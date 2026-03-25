const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BALE_URL = 'https://web.bale.ai/';
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure log directory exists
fs.mkdirSync(LOG_DIR, { recursive: true });

// Create write streams for each browser
function createLogger(name) {
  const httpStream = fs.createWriteStream(path.join(LOG_DIR, `${name}-http.jsonl`), { flags: 'w' });
  const wsStream = fs.createWriteStream(path.join(LOG_DIR, `${name}-ws.jsonl`), { flags: 'w' });
  const rtcStream = fs.createWriteStream(path.join(LOG_DIR, `${name}-rtc.jsonl`), { flags: 'w' });
  const allStream = fs.createWriteStream(path.join(LOG_DIR, `${name}-all.log`), { flags: 'w' });

  function log(type, data) {
    const entry = { ts: new Date().toISOString(), type, ...data };
    const line = JSON.stringify(entry) + '\n';
    allStream.write(line);

    if (type === 'http-req' || type === 'http-resp') httpStream.write(line);
    if (type.startsWith('ws')) wsStream.write(line);
    if (type.startsWith('rtc')) rtcStream.write(line);

    // Console summary
    const short = `[${name}] ${type}: ${data.url || data.summary || ''}`;
    console.log(short.slice(0, 200));
  }

  return { log, close: () => { httpStream.end(); wsStream.end(); rtcStream.end(); allStream.end(); } };
}

async function setupPage(context, name, logger) {
  const page = await context.newPage();

  // --- HTTP Request Logging ---
  page.on('request', req => {
    logger.log('http-req', {
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: req.postData()?.slice(0, 2000),
    });
  });

  page.on('response', async resp => {
    const url = resp.url();
    let body = null;

    // Capture response body for API calls (not images/scripts/css)
    const ct = resp.headers()['content-type'] || '';
    if ((ct.includes('json') || ct.includes('protobuf') || ct.includes('grpc') || url.includes('/api/')) && resp.status() < 400) {
      try {
        body = (await resp.body()).toString('utf-8').slice(0, 5000);
      } catch {}
    }

    logger.log('http-resp', {
      url,
      status: resp.status(),
      contentType: ct,
      body,
    });
  });

  // --- WebSocket Logging ---
  page.on('websocket', ws => {
    const wsUrl = ws.url();
    logger.log('ws-open', { url: wsUrl });

    ws.on('framereceived', frame => {
      let data = frame.payload;
      if (typeof data !== 'string') {
        data = `<binary ${data.length} bytes>`;
      }
      logger.log('ws-recv', { url: wsUrl, data: data.slice(0, 3000) });
    });

    ws.on('framesent', frame => {
      let data = frame.payload;
      if (typeof data !== 'string') {
        data = `<binary ${data.length} bytes>`;
      }
      logger.log('ws-send', { url: wsUrl, data: data.slice(0, 3000) });
    });

    ws.on('close', () => {
      logger.log('ws-close', { url: wsUrl });
    });
  });

  // --- WebRTC Logging via CDP ---
  const cdp = await context.newCDPSession(page);

  // Enable WebRTC internals logging
  await cdp.send('Network.enable');

  // Inject JS to intercept RTCPeerConnection
  await page.addInitScript(() => {
    // Intercept RTCPeerConnection creation
    const OrigRTC = window.RTCPeerConnection;
    window.__rtcConnections = [];
    window.__rtcLogs = [];

    function rtcLog(type, data) {
      const entry = { ts: Date.now(), type, ...data };
      window.__rtcLogs.push(entry);
      console.log(`[RTC] ${type}:`, JSON.stringify(data).slice(0, 500));
    }

    window.RTCPeerConnection = function(...args) {
      rtcLog('new-pc', { config: JSON.stringify(args[0]) });
      const pc = new OrigRTC(...args);
      window.__rtcConnections.push(pc);

      // Intercept setLocalDescription
      const origSetLocal = pc.setLocalDescription.bind(pc);
      pc.setLocalDescription = function(desc) {
        rtcLog('setLocalDescription', { type: desc?.type, sdp: desc?.sdp?.slice(0, 2000) });
        return origSetLocal(desc);
      };

      // Intercept setRemoteDescription
      const origSetRemote = pc.setRemoteDescription.bind(pc);
      pc.setRemoteDescription = function(desc) {
        rtcLog('setRemoteDescription', { type: desc?.type, sdp: desc?.sdp?.slice(0, 2000) });
        return origSetRemote(desc);
      };

      // Intercept createOffer
      const origOffer = pc.createOffer.bind(pc);
      pc.createOffer = async function(...args) {
        const offer = await origOffer(...args);
        rtcLog('createOffer', { type: offer.type, sdp: offer.sdp?.slice(0, 2000) });
        return offer;
      };

      // Intercept createAnswer
      const origAnswer = pc.createAnswer.bind(pc);
      pc.createAnswer = async function(...args) {
        const answer = await origAnswer(...args);
        rtcLog('createAnswer', { type: answer.type, sdp: answer.sdp?.slice(0, 2000) });
        return answer;
      };

      // Intercept addIceCandidate
      const origAddIce = pc.addIceCandidate.bind(pc);
      pc.addIceCandidate = function(candidate) {
        rtcLog('addIceCandidate', { candidate: candidate?.candidate?.slice(0, 500) });
        return origAddIce(candidate);
      };

      // Log ICE candidates
      pc.onicecandidate = (function(origHandler) {
        return function(event) {
          if (event.candidate) {
            rtcLog('iceCandidate', { candidate: event.candidate.candidate.slice(0, 500) });
          }
          if (origHandler) origHandler(event);
        };
      })(pc.onicecandidate);

      // Log state changes
      pc.oniceconnectionstatechange = (function(origHandler) {
        return function() {
          rtcLog('iceState', { state: pc.iceConnectionState });
          if (origHandler) origHandler();
        };
      })(pc.oniceconnectionstatechange);

      pc.onconnectionstatechange = (function(origHandler) {
        return function() {
          rtcLog('connState', { state: pc.connectionState });
          if (origHandler) origHandler();
        };
      })(pc.onconnectionstatechange);

      pc.onsignalingstatechange = (function(origHandler) {
        return function() {
          rtcLog('signalingState', { state: pc.signalingState });
          if (origHandler) origHandler();
        };
      })(pc.onsignalingstatechange);

      // Log tracks
      pc.ontrack = (function(origHandler) {
        return function(event) {
          rtcLog('ontrack', { kind: event.track.kind, id: event.track.id });
          if (origHandler) origHandler(event);
        };
      })(pc.ontrack);

      // Log data channels
      pc.ondatachannel = (function(origHandler) {
        return function(event) {
          rtcLog('ondatachannel', { label: event.channel.label });
          if (origHandler) origHandler(event);
        };
      })(pc.ondatachannel);

      // Intercept addTrack
      const origAddTrack = pc.addTrack.bind(pc);
      pc.addTrack = function(track, ...streams) {
        rtcLog('addTrack', { kind: track.kind, id: track.id });
        return origAddTrack(track, ...streams);
      };

      return pc;
    };
    window.RTCPeerConnection.prototype = OrigRTC.prototype;
  });

  // Periodically flush RTC logs from page context
  setInterval(async () => {
    try {
      const logs = await page.evaluate(() => {
        const l = window.__rtcLogs || [];
        window.__rtcLogs = [];
        return l;
      });
      for (const entry of logs) {
        logger.log('rtc-' + entry.type, entry);
      }
    } catch {}
  }, 1000);

  return page;
}

async function main() {
  console.log('=== Bale Video Call Interceptor ===');
  console.log(`Logs will be written to: ${LOG_DIR}`);
  console.log('');

  // Profile directories for persistent login
  const profileA = path.join(__dirname, 'profile-a');
  const profileB = path.join(__dirname, 'profile-b');

  // Launch two separate browser instances with persistent contexts
  console.log('Launching Browser A...');
  const contextA = await chromium.launchPersistentContext(profileA, {
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
    ignoreHTTPSErrors: true,
  });

  console.log('Launching Browser B...');
  const contextB = await chromium.launchPersistentContext(profileB, {
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
    ],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
    ignoreHTTPSErrors: true,
  });

  const loggerA = createLogger('browser-a');
  const loggerB = createLogger('browser-b');

  console.log('Setting up interception on Browser A...');
  const pageA = await setupPage(contextA, 'A', loggerA);

  console.log('Setting up interception on Browser B...');
  const pageB = await setupPage(contextB, 'B', loggerB);

  console.log('');
  console.log('Opening Bale on both browsers...');
  await pageA.goto(BALE_URL, { waitUntil: 'domcontentloaded' });
  await pageB.goto(BALE_URL, { waitUntil: 'domcontentloaded' });

  // Inject visible labels so the user can tell them apart
  await pageA.evaluate(() => {
    const banner = document.createElement('div');
    banner.textContent = 'BROWSER A — CALLER';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#e74c3c;color:#fff;text-align:center;font:bold 18px sans-serif;padding:6px 0;pointer-events:none;opacity:0.9;';
    document.body.appendChild(banner);
    document.title = '[A - CALLER] ' + document.title;
  });
  await pageB.evaluate(() => {
    const banner = document.createElement('div');
    banner.textContent = 'BROWSER B — RECEIVER';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#2ecc71;color:#fff;text-align:center;font:bold 18px sans-serif;padding:6px 0;pointer-events:none;opacity:0.9;';
    document.body.appendChild(banner);
    document.title = '[B - RECEIVER] ' + document.title;
  });

  console.log('');
  console.log('=============================================');
  console.log(' Both browsers are open at web.bale.ai');
  console.log(' 1. Log in on both browsers');
  console.log(' 2. Start a video call from A to B');
  console.log(' 3. Answer on B');
  console.log(' 4. When done, press Ctrl+C here');
  console.log('');
  console.log(' All traffic is being logged to:');
  console.log(`   ${LOG_DIR}/`);
  console.log('=============================================');

  // Keep alive until Ctrl+C
  process.on('SIGINT', async () => {
    console.log('\nCapturing final RTC state...');

    // Dump final RTC connection state
    for (const [name, page, logger] of [['A', pageA, loggerA], ['B', pageB, loggerB]]) {
      try {
        const rtcState = await page.evaluate(() => {
          return (window.__rtcConnections || []).map((pc, i) => ({
            index: i,
            iceConnectionState: pc.iceConnectionState,
            connectionState: pc.connectionState,
            signalingState: pc.signalingState,
            localDesc: pc.localDescription ? { type: pc.localDescription.type, sdp: pc.localDescription.sdp } : null,
            remoteDesc: pc.remoteDescription ? { type: pc.remoteDescription.type, sdp: pc.remoteDescription.sdp } : null,
            senders: pc.getSenders().map(s => ({ kind: s.track?.kind, id: s.track?.id })),
            receivers: pc.getReceivers().map(r => ({ kind: r.track?.kind, id: r.track?.id })),
          }));
        });
        logger.log('rtc-final-state', { connections: rtcState });
        console.log(`[${name}] Final RTC state: ${rtcState.length} connections`);
        for (const conn of rtcState) {
          console.log(`  PC[${conn.index}]: ice=${conn.iceConnectionState} conn=${conn.connectionState} sig=${conn.signalingState}`);
          console.log(`    senders: ${conn.senders.map(s => s.kind).join(', ')}`);
          console.log(`    receivers: ${conn.receivers.map(r => r.kind).join(', ')}`);
        }
      } catch (e) {
        console.log(`[${name}] Could not capture final state: ${e.message}`);
      }
    }

    loggerA.close();
    loggerB.close();

    console.log('\nLogs saved. Closing browsers...');
    await contextA.close();
    await contextB.close();
    process.exit(0);
  });

  // Keep process alive
  await new Promise(() => {});
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
