#!/usr/bin/env node
// QR Tunnel — Bale Browser Bridge v4
// Strategy: Intercept getUserMedia, pipe camera through canvas transform, return modified stream
const { chromium } = require('playwright');
const { WebSocketServer } = require('ws');
const path = require('path');

const args = process.argv.slice(2);
const role = args.find((_, i, a) => a[i - 1] === '--role') || 'callee';
const targetUser = args.find((_, i, a) => a[i - 1] === '--target') || '884923192';
const wsPort = parseInt(args.find((_, i, a) => a[i - 1] === '--ws-port') || '9000');
const profileDir = args.find((_, i, a) => a[i - 1] === '--profile') ||
  path.join(__dirname, role === 'caller' ? 'profile-a' : 'profile-b');
const FPS = 20; // Higher capture rate for bitmap codec
const FAKE_CAMERA = '/tmp/qr-fake-camera.y4m';

console.log(`[bridge] role=${role} target=${targetUser} ws=${wsPort}`);

let goSocket = null, page = null, callActive = false;

// --- WS server ---
const wss = new WebSocketServer({ port: wsPort });
console.log(`[bridge] WS on :${wsPort}`);
wss.on('connection', ws => {
  console.log('[bridge] Go connected');
  goSocket = ws;
  if (callActive) ws.send('connected');
  ws.on('message', data => { if (data instanceof Buffer && data.length > 8) drawQRFrame(data); });
  ws.on('close', () => { goSocket = null; });
});

function sendToGo(jpegBuf, seq) {
  if (!goSocket || goSocket.readyState !== 1) return;
  const hdr = Buffer.alloc(8);
  hdr.writeUInt32BE(seq, 0); hdr.writeUInt16BE(720, 4); hdr.writeUInt16BE(720, 6);
  try { goSocket.send(Buffer.concat([hdr, jpegBuf])); } catch {}
}

let txCount = 0;

async function drawQRFrame(data) {
  if (!page) return;
  try {
    const b64 = data.slice(8).toString('base64');
    // Draw directly — synchronous with Go's send rate
    // This ensures the canvas is updated immediately when Go sends a new frame
    await page.evaluate(async (b64) => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => { window.__goFrame = img; resolve(true); };
        img.onerror = () => resolve(false);
        img.src = 'data:image/jpeg;base64,' + b64;
        setTimeout(() => resolve(false), 2000);
      });
    }, b64);
    txCount++;
  } catch {}
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- INIT SCRIPT ---
// Key insight: Instead of replaceTrack, we intercept getUserMedia and return
// a TRANSFORMED stream. The camera frames pass through our canvas where we
// can draw QR codes on top. LiveKit gets this stream from the start.
const INIT_SCRIPT = `
(function() {
  window.__goFrame = null;
  window.__qrCanvas = null;
  window.__qrCtx = null;

  // === DataChannel Discovery ===
  // Hook RTCPeerConnection to find LiveKit's DataChannels
  window.__dcAll = [];
  window.__pcAll = [];
  const _origPC = window.RTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    const pc = new _origPC(...args);
    window.__pcAll.push(pc);
    console.log('[DC] PeerConnection #' + window.__pcAll.length);
    const _origCreateDC = pc.createDataChannel.bind(pc);
    pc.createDataChannel = function(label, opts) {
      const dc = _origCreateDC(label, opts);
      console.log('[DC] createDataChannel: ' + label + ' ' + JSON.stringify(opts||{}));
      window.__dcAll.push({label, dc, pc, dir:'local'});
      dc.onopen = () => console.log('[DC] OPEN: ' + label);
      return dc;
    };
    pc.addEventListener('datachannel', (e) => {
      console.log('[DC] remote datachannel: ' + e.channel.label);
      window.__dcAll.push({label: e.channel.label, dc: e.channel, pc, dir:'remote'});
    });
    return pc;
  };
  window.RTCPeerConnection.prototype = _origPC.prototype;
  Object.keys(_origPC).forEach(k => { try { window.RTCPeerConnection[k] = _origPC[k]; } catch(e){} });
  window.__frameN = 0;

  const origGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  navigator.mediaDevices.getUserMedia = async function(constraints) {
    console.log('[qr] getUserMedia:', JSON.stringify(constraints));

    if (!constraints?.video) return origGUM(constraints);

    // Get the real camera stream (fake Y4M camera via Chrome flag)
    const realStream = await origGUM(constraints);
    const realVideoTrack = realStream.getVideoTracks()[0];

    if (!realVideoTrack) return realStream;

    console.log('[qr] Intercepting video track, creating canvas transform pipeline');

    // Create canvas for drawing
    if (!window.__qrCanvas) {
      const c = document.createElement('canvas');
      c.width = 720; c.height = 720;
      c.style.cssText = 'position:fixed;bottom:5px;right:5px;width:100px;height:100px;z-index:999999;border:2px solid lime;';
      document.body?.appendChild(c);
      window.__qrCanvas = c;
      window.__qrCtx = c.getContext('2d');
    }

    // Use MediaStreamTrackProcessor to read frames from the real camera,
    // transform them through our canvas, and output via MediaStreamTrackGenerator
    if (typeof MediaStreamTrackProcessor !== 'undefined' && typeof MediaStreamTrackGenerator !== 'undefined') {
      console.log('[qr] Using TransformStream pipeline (MediaStreamTrackProcessor/Generator)');

      const processor = new MediaStreamTrackProcessor({ track: realVideoTrack });
      const generator = new MediaStreamTrackGenerator({ kind: 'video' });

      const transformer = new TransformStream({
        async transform(videoFrame, controller) {
          window.__frameN++;
          const ctx = window.__qrCtx;

          if (window.__goFrame) {
            // Draw QR code from Go binary
            ctx.drawImage(window.__goFrame, 0, 0, 720, 720);
          } else {
            // Draw the real camera frame with "QR TUNNEL" overlay
            ctx.drawImage(videoFrame, 0, 0, 720, 720);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            ctx.fillRect(200, 300, 320, 80);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('QR TUNNEL', 360, 340);
            ctx.font = '16px monospace';
            ctx.fillText('Waiting...', 360, 365);
          }

          // Create new VideoFrame from canvas
          const newFrame = new VideoFrame(window.__qrCanvas, {
            timestamp: videoFrame.timestamp,
            alpha: 'discard',
          });
          videoFrame.close();
          controller.enqueue(newFrame);
        }
      });

      processor.readable.pipeThrough(transformer).pipeTo(generator.writable);

      // Build output stream: transformed video + real audio
      const outputStream = new MediaStream();
      outputStream.addTrack(generator);
      realStream.getAudioTracks().forEach(t => outputStream.addTrack(t));

      console.log('[qr] Pipeline active! Returning transformed stream');
      return outputStream;

    } else {
      // Fallback: use captureStream on canvas (less reliable but works without experimental APIs)
      console.log('[qr] TransformStream not available, using captureStream fallback');

      // Draw real camera onto canvas continuously
      const video = document.createElement('video');
      video.srcObject = new MediaStream([realVideoTrack]);
      video.play();

      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvasStream = window.__qrCanvas.captureStream(15);

      function drawLoop() {
        window.__frameN++;
        const ctx = window.__qrCtx;
        if (window.__goFrame) {
          ctx.drawImage(window.__goFrame, 0, 0, 720, 720);
        } else if (video.readyState >= 2) {
          ctx.drawImage(video, 0, 0, 720, 720);
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillRect(200, 300, 320, 80);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 28px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('QR TUNNEL', 360, 340);
          ctx.font = '16px monospace';
          ctx.fillText('Waiting...', 360, 365);
        }
        requestAnimationFrame(drawLoop);
      }
      requestAnimationFrame(drawLoop);

      const outputStream = new MediaStream();
      canvasStream.getVideoTracks().forEach(t => outputStream.addTrack(t));
      realStream.getAudioTracks().forEach(t => outputStream.addTrack(t));

      console.log('[qr] Canvas fallback active');
      return outputStream;
    }
  };

  // Frame capture from remote video
  window.__remoteVideo = null;
  window.__captureCanvas = null;
  window.__captureCtx = null;

  window.__captureRemote = function() {
    if (!window.__remoteVideo || window.__remoteVideo.paused || window.__remoteVideo.videoWidth < 50) {
      window.__remoteVideo = null;
      const vids = Array.from(document.querySelectorAll('video'))
        .filter(v => !v.paused && v.readyState >= 2 && v.videoWidth > 50)
        .sort((a, b) => {
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return (rb.width * rb.height) - (ra.width * ra.height);
        });
      if (vids.length >= 2) window.__remoteVideo = vids[0];
    }
    const v = window.__remoteVideo;
    if (!v) return null;
    if (!window.__captureCtx) {
      window.__captureCanvas = document.createElement('canvas');
      window.__captureCanvas.width = 720; window.__captureCanvas.height = 720;
      window.__captureCtx = window.__captureCanvas.getContext('2d');
    }
    try {
      window.__captureCtx.drawImage(v, 0, 0, 720, 720);
      return { dataUrl: window.__captureCanvas.toDataURL('image/png'), vw: v.videoWidth, vh: v.videoHeight };
    } catch(e) { return { error: e.message }; }
  };
})();
`;

async function main() {
  const launchOpts = {
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled', '--no-sandbox', '--no-proxy-server',
      '--disable-web-security', '--disable-site-isolation-trials',
      '--use-fake-device-for-media-stream', `--use-file-for-fake-video-capture=${FAKE_CAMERA}`,
      '--enable-blink-features=MediaStreamInsertableStreams',
    ],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
    ignoreHTTPSErrors: true,
  };
  // Use system Chrome if set (avoids needing Playwright's bundled Chromium)
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }
  const context = await chromium.launchPersistentContext(profileDir, launchOpts);

  page = context.pages()[0] || await context.newPage();
  await page.addInitScript(INIT_SCRIPT);

  console.log('[bridge] Opening Bale...');
  if (role === 'caller') {
    await page.goto(`https://web.bale.ai/chat?uid=${targetUser}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  } else {
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  }
  await sleep(10000);

  // Label
  const color = role === 'caller' ? '#e74c3c' : '#2ecc71';
  const label = role === 'caller' ? `CALLER → ${targetUser}` : 'SERVER (auto-answer)';
  await page.evaluate(({c,l}) => {
    const d = document.createElement('div');
    d.textContent = l; d.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:999999;background:${c};color:#fff;text-align:center;font:bold 15px sans-serif;padding:3px 0;pointer-events:none;opacity:0.85;`;
    document.body.appendChild(d);
  }, {c:color,l:label});

  if (role === 'caller') {
    await doCaller(page);
  } else {
    await doCallee(page);
  }

  startCapture(page);
  console.log('[bridge] Running.');

  // Log DataChannel state every 10 seconds
  setInterval(async () => {
    try {
      const dcState = await page.evaluate(() => {
        return (window.__dcAll || []).map(d => ({
          label: d.label, dir: d.dir, state: d.dc.readyState
        }));
      });
      if (dcState.length > 0) {
        console.log('[DC-state]', JSON.stringify(dcState));
      }
    } catch {}
  }, 10000);

  process.on('SIGINT', async () => { wss.close(); await context.close(); process.exit(0); });
  await new Promise(() => {});
}

async function doCaller(page) {
  console.log('[bridge] Click video call...');
  try { const b = await page.waitForSelector('[data-testid="video-"]', { timeout: 15000 }); await b.click(); } catch {}
  await sleep(3000);
  await findAndClick(page, ['Start Call', 'start call', 'START CALL', 'Call', 'Start', 'Video Call', 'تماس تصویری', 'شروع تماس', 'تماس'], 30000);
  await sleep(3000);
  await waitForCall(page);
}

async function doCallee(page) {
  console.log('[bridge] Waiting for call...');
  await findAndClick(page, ['Answer', 'answer', 'پاسخ', 'قبول'], 300000);
  await sleep(3000);
  await findAndClick(page, ['Answer Call', 'Start Call', 'start call', 'پاسخ به تماس', 'شروع تماس', 'قبول تماس'], 30000);
  await sleep(3000);
  await waitForCall(page);
}

async function waitForCall(page) {
  for (let i = 0; i < 30; i++) {
    const n = await page.evaluate(() => Array.from(document.querySelectorAll('video')).filter(v => !v.paused && v.readyState >= 2).length);
    console.log(`[bridge] ${n} playing videos`);
    if (n >= 2) { console.log('[bridge] *** CALL ACTIVE ***'); callActive = true; if (goSocket) goSocket.send('connected'); return; }
    await sleep(2000);
  }
  console.log('[bridge] Timeout'); callActive = true; if (goSocket) goSocket.send('connected');
}

async function findAndClick(page, texts, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const text of texts) {
      const pos = await page.evaluate(t => {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          if (w.currentNode.textContent.trim() === t) {
            let el = w.currentNode.parentElement;
            for (let j = 0; j < 6 && el; j++) {
              const r = el.getBoundingClientRect();
              if (r.width > 30 && r.height > 25 && r.y > 100) return { x: r.x + r.width/2, y: r.y + r.height/2 };
              el = el.parentElement;
            }
          }
        }
        return null;
      }, text);
      if (pos) { console.log(`[bridge] click "${text}" at (${Math.round(pos.x)},${Math.round(pos.y)})`); await page.mouse.click(pos.x, pos.y); return; }
    }
    await sleep(500);
  }
  console.log(`[bridge] WARN: [${texts.join(',')}] not found`);
}

function startCapture(page) {
  let seq = 0, ok = 0, err = 0, consecutiveEmpty = 0;
  setInterval(async () => {
    if (!goSocket || goSocket.readyState !== 1) return;
    try {
      const r = await page.evaluate(() => window.__captureRemote?.());
      if (!r) {
        consecutiveEmpty++;
        if (consecutiveEmpty % 60 === 0) console.log('[bridge] capture: waiting');
        // Detect call ended: if we had frames before but none for 30+ seconds
        if (ok > 10 && consecutiveEmpty > FPS * 30) {
          console.log('[bridge] Call ended (no video for 30s). Exiting.');
          process.exit(0);
        }
        return;
      }
      if (r.error) { if (err++ % 30 === 0) console.log(`[bridge] capture: ${r.error}`); return; }
      consecutiveEmpty = 0;
      const b64 = r.dataUrl.split(',')[1];
      if (!b64) return;
      sendToGo(Buffer.from(b64, 'base64'), ++seq);
      if (++ok % 60 === 1) console.log(`[bridge] rx←video #${ok} (${r.vw}x${r.vh})`);
    } catch (e) { if (err++ % 60 === 0) console.log(`[bridge] capture err: ${e.message}`); }
  }, Math.floor(1000 / FPS));
}

main().catch(e => { console.error('[bridge] FATAL:', e); process.exit(1); });
