#!/usr/bin/env node
// QR Tunnel — Bale Browser Bridge v3
// Strategy: Use Chrome's fake camera for call setup, then replaceTrack with QR canvas
const { chromium } = require('playwright');
const { WebSocketServer } = require('ws');
const path = require('path');

const args = process.argv.slice(2);
const role = args.find((_, i, a) => a[i - 1] === '--role') || 'callee';
const targetUser = args.find((_, i, a) => a[i - 1] === '--target') || '884923192';
const wsPort = parseInt(args.find((_, i, a) => a[i - 1] === '--ws-port') || '9000');
const profileDir = args.find((_, i, a) => a[i - 1] === '--profile') ||
  path.join(__dirname, role === 'caller' ? 'profile-a' : 'profile-b');
const FPS = 10;
const FAKE_CAMERA = '/tmp/qr-fake-camera.y4m';

console.log(`[bridge] role=${role} target=${targetUser} ws=${wsPort}`);

let goSocket = null, page = null, callActive = false;

// --- WS server for Go binary ---
const wss = new WebSocketServer({ port: wsPort });
console.log(`[bridge] WS on :${wsPort}`);
wss.on('connection', ws => {
  console.log('[bridge] Go binary connected');
  goSocket = ws;
  if (callActive) ws.send('connected');
  ws.on('message', data => {
    if (data instanceof Buffer && data.length > 8) drawQRFrame(data);
  });
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
    // Wait for the image to actually load before returning
    const result = await page.evaluate(async (b64) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          window.__goFrame = img;
          window.__goFrameCount = (window.__goFrameCount || 0) + 1;
          resolve({ ok: true, goFrameCount: window.__goFrameCount });
        };
        img.onerror = (e) => {
          window.__goFrameErrors = (window.__goFrameErrors || 0) + 1;
          resolve({ error: 'image load failed', errors: window.__goFrameErrors });
        };
        img.src = 'data:image/jpeg;base64,' + b64;
        // Timeout fallback
        setTimeout(() => resolve({ error: 'timeout', goFrameCount: window.__goFrameCount || 0 }), 3000);
      });
    }, b64);
    txCount++;
    if (txCount % 5 === 1) {
      console.log(`[bridge] tx→canvas #${txCount}: ${JSON.stringify(result)}`);
    }
  } catch(e) {
    console.log(`[bridge] drawQRFrame error: ${e.message}`);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- INIT SCRIPT ---
// Only hooks addTrack prototype and sets up canvas/replaceTrack AFTER call starts.
// The camera feed comes from Chrome's --use-file-for-fake-video-capture flag.
const INIT_SCRIPT = `
(function() {
  window.__goFrame = null;
  window.__qrCanvas = null;
  window.__qrCtx = null;
  window.__qrStream = null;
  window.__videoSenders = [];
  window.__trackReplaced = false;

  // Hook addTrack AND addTransceiver on prototype — catches ALL PCs
  const origAddTrack = RTCPeerConnection.prototype.addTrack;
  RTCPeerConnection.prototype.addTrack = function(track, ...streams) {
    const sender = origAddTrack.call(this, track, ...streams);
    if (track.kind === 'video') {
      window.__videoSenders.push(sender);
      console.log('[qr] video sender via addTrack #' + window.__videoSenders.length);
    }
    return sender;
  };

  const origAddTransceiver = RTCPeerConnection.prototype.addTransceiver;
  RTCPeerConnection.prototype.addTransceiver = function(trackOrKind, init) {
    const transceiver = origAddTransceiver.call(this, trackOrKind, init);
    const kind = typeof trackOrKind === 'string' ? trackOrKind : trackOrKind?.kind;
    if (kind === 'video' && transceiver.sender) {
      window.__videoSenders.push(transceiver.sender);
      console.log('[qr] video sender via addTransceiver #' + window.__videoSenders.length);
    }
    return transceiver;
  };

  // Also hook getSenders to discover senders after the fact
  const origGetSenders = RTCPeerConnection.prototype.getSenders;
  RTCPeerConnection.prototype.getSenders = function() {
    const senders = origGetSenders.call(this);
    for (const s of senders) {
      if (s.track?.kind === 'video' && !window.__videoSenders.includes(s)) {
        window.__videoSenders.push(s);
        console.log('[qr] video sender via getSenders #' + window.__videoSenders.length);
      }
    }
    return senders;
  };

  // Setup QR canvas and replace video track on all senders
  window.__setupAndReplace = async function() {
    if (window.__trackReplaced) return 'already replaced';

    // Create canvas
    if (!window.__qrCanvas) {
      const c = document.createElement('canvas');
      c.width = 720; c.height = 720;
      c.style.cssText = 'position:fixed;bottom:5px;right:5px;width:100px;height:100px;z-index:999999;border:2px solid lime;';
      document.body.appendChild(c);
      window.__qrCanvas = c;
      window.__qrCtx = c.getContext('2d');
      window.__qrCtx.fillStyle = '#fff';
      window.__qrCtx.fillRect(0, 0, 720, 720);

      // Wait for render
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.__qrStream = c.captureStream(15);

      // Draw loop — always draw the latest Go frame if available.
      // Go frame persists on canvas until the next Go frame arrives.
      let n = 0;
      (function draw() {
        n++;
        const ctx = window.__qrCtx;
        if (window.__goFrame) {
          // Draw QR frame from Go binary — this stays until next frame
          ctx.drawImage(window.__goFrame, 0, 0, 720, 720);
        } else {
          // No Go frame yet — show animated placeholder (must change for captureStream)
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 720, 720);
          ctx.fillStyle = '#000';
          ctx.font = 'bold 36px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('QR TUNNEL', 360, 330);
          ctx.font = '18px monospace';
          ctx.fillText('Active', 360, 370);
          const x = 360 + Math.sin(n * 0.05) * 100;
          ctx.fillRect(x-4, 400, 8, 8);
        }
        requestAnimationFrame(draw);
      })();
    }

    const settings = window.__qrStream.getVideoTracks()[0]?.getSettings?.();
    console.log('[qr] canvas stream:', settings?.width + 'x' + settings?.height);

    // Replace track on all captured senders
    const qrTrack = window.__qrStream.getVideoTracks()[0];
    if (!qrTrack) return 'no qr track';

    let replaced = 0;
    for (const sender of window.__videoSenders) {
      try {
        await sender.replaceTrack(qrTrack);
        replaced++;
      } catch(e) {
        console.log('[qr] replaceTrack failed:', e.message);
      }
    }

    if (replaced > 0) {
      window.__trackReplaced = true;
      return 'replaced ' + replaced + ' senders (stream: ' + settings?.width + 'x' + settings?.height + ')';
    }
    return 'no senders to replace (have ' + window.__videoSenders.length + ')';
  };

  // Capture remote video frame
  window.__remoteVideo = null;
  window.__captureCanvas = null;
  window.__captureCtx = null;

  window.__captureRemote = function() {
    if (!window.__remoteVideo || window.__remoteVideo.paused || window.__remoteVideo.videoWidth < 10) {
      window.__remoteVideo = null;
      // Find largest playing video with real dimensions
      const vids = Array.from(document.querySelectorAll('video'))
        .filter(v => !v.paused && v.readyState >= 2 && v.videoWidth > 50);
      if (vids.length >= 2) {
        vids.sort((a,b) => (b.getBoundingClientRect().width * b.getBoundingClientRect().height) - (a.getBoundingClientRect().width * a.getBoundingClientRect().height));
        window.__remoteVideo = vids[0];
      }
    }

    const v = window.__remoteVideo;
    if (!v) return null;

    if (!window.__captureCtx) {
      window.__captureCanvas = document.createElement('canvas');
      window.__captureCanvas.width = 720;
      window.__captureCanvas.height = 720;
      window.__captureCtx = window.__captureCanvas.getContext('2d');
    }

    try {
      window.__captureCtx.drawImage(v, 0, 0, 720, 720);
      return { dataUrl: window.__captureCanvas.toDataURL('image/jpeg', 0.85), vw: v.videoWidth, vh: v.videoHeight };
    } catch(e) {
      return { error: e.message };
    }
  };
})();
`;

async function main() {
  console.log('[bridge] Launching browser...');
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-web-security',
      '--disable-site-isolation-trials',
      // Use fake camera with a real test pattern video — Bale/LiveKit sees a working camera
      '--use-fake-device-for-media-stream',
      `--use-file-for-fake-video-capture=${FAKE_CAMERA}`,
    ],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
    ignoreHTTPSErrors: true,
  });

  page = context.pages()[0] || await context.newPage();
  await page.addInitScript(INIT_SCRIPT);

  console.log('[bridge] Opening Bale...');
  if (role === 'caller') {
    await page.goto(`https://web.bale.ai/chat?uid=${targetUser}`, { waitUntil: 'networkidle' });
  } else {
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded' });
  }
  await sleep(5000);
  console.log('[bridge] Bale loaded');

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

  // After call is active, swap the fake camera track with QR canvas
  console.log('[bridge] Attempting track replacement...');
  for (let i = 0; i < 20; i++) {
    const result = await page.evaluate(async () => {
      // First try the addTrack-captured senders
      let res = await window.__setupAndReplace?.();
      if (res?.includes('replaced')) return res;

      // Fallback: Try to find video senders by triggering getSenders on all PCs
      // The getSenders hook will capture any video senders it finds
      // Trigger it by calling getSenders on window.__pcs or via other means

      // Also try to find the local video track and use sender.replaceTrack directly
      const vids = Array.from(document.querySelectorAll('video'))
        .filter(v => !v.paused && v.readyState >= 2 && v.srcObject);

      if (!window.__qrStream) return 'no qr stream yet';
      const qrTrack = window.__qrStream.getVideoTracks()[0];
      if (!qrTrack) return 'no qr track';

      // Try replaceTrack on all captured senders (hooks may have found some via getSenders)
      if (window.__videoSenders.length > 0) {
        let replaced = 0;
        for (const sender of window.__videoSenders) {
          try { await sender.replaceTrack(qrTrack); replaced++; } catch {}
        }
        if (replaced > 0) {
          window.__trackReplaced = true;
          return 'REPLACED via sender.replaceTrack (' + replaced + ' senders)';
        }
      }

      // Last resort: MediaStream swap on local preview
      if (vids.length >= 2) {
        vids.sort((a,b) => {
          const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return (ra.width * ra.height) - (rb.width * rb.height);
        });
        const localStream = vids[0].srcObject;
        const localTrack = localStream?.getVideoTracks()[0];
        if (localTrack) {
          try {
            localStream.removeTrack(localTrack);
            localStream.addTrack(qrTrack);
            localTrack.stop();
            window.__trackReplaced = true;
            return 'REPLACED via MediaStream swap';
          } catch(e) {}
        }
      }

      return 'no senders found (have ' + window.__videoSenders.length + ', videos: ' + vids.length + ')';
    });
    console.log(`[bridge] attempt ${i+1}: ${result}`);
    if (result?.includes('REPLACED')) break;
    await sleep(2000);
  }

  startCapture(page);
  console.log('[bridge] Running. Ctrl+C to stop.');
  process.on('SIGINT', async () => { wss.close(); await context.close(); process.exit(0); });
  await new Promise(() => {});
}

async function doCaller(page) {
  console.log('[bridge] Clicking video call button...');
  const btn = await page.waitForSelector('[data-testid="video-"]', { timeout: 10000, state: 'visible' });
  await btn.click();
  await sleep(2000);

  console.log('[bridge] Clicking Start Call...');
  await findAndClick(page, ['Start Call']);
  await sleep(3000);

  console.log('[bridge] Waiting for call...');
  await waitForCall(page);
}

async function doCallee(page) {
  console.log('[bridge] Waiting for incoming call...');

  // Wait and click through: Answer → Answer Call
  await findAndClick(page, ['Answer'], 300000);
  await sleep(2000);
  await findAndClick(page, ['Answer Call', 'Start Call'], 15000);
  await sleep(3000);

  console.log('[bridge] Waiting for call...');
  await waitForCall(page);
}

async function waitForCall(page) {
  for (let i = 0; i < 30; i++) {
    const info = await page.evaluate(() => {
      const vids = Array.from(document.querySelectorAll('video')).filter(v => !v.paused && v.readyState >= 2);
      return { playing: vids.length, dims: vids.map(v => v.videoWidth+'x'+v.videoHeight).join(','), senders: window.__videoSenders?.length || 0 };
    });
    console.log(`[bridge] ${info.playing} playing [${info.dims}] senders=${info.senders}`);
    if (info.playing >= 2) {
      console.log('[bridge] *** CALL ACTIVE ***');
      callActive = true;
      if (goSocket) goSocket.send('connected');
      return;
    }
    await sleep(2000);
  }
  console.log('[bridge] Timeout — continuing');
  callActive = true;
  if (goSocket) goSocket.send('connected');
}

// Find text on page and click it with real mouse event. Retries until timeout.
async function findAndClick(page, texts, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const text of texts) {
      const pos = await page.evaluate(text => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          if (walker.currentNode.textContent.trim() === text) {
            let el = walker.currentNode.parentElement;
            for (let i = 0; i < 6 && el; i++) {
              const r = el.getBoundingClientRect();
              if (r.width > 30 && r.height > 25 && r.y > 100) {
                return { x: r.x + r.width/2, y: r.y + r.height/2, text, w: r.width, h: r.height };
              }
              el = el.parentElement;
            }
          }
        }
        return null;
      }, text);

      if (pos) {
        console.log(`[bridge] Clicking "${pos.text}" at (${Math.round(pos.x)},${Math.round(pos.y)} ${Math.round(pos.w)}x${Math.round(pos.h)})`);
        await page.mouse.click(pos.x, pos.y);
        return;
      }
    }
    await sleep(500);
  }
  console.log(`[bridge] WARNING: texts [${texts.join(', ')}] not found within ${timeout}ms`);
}

function startCapture(page) {
  let seq = 0, ok = 0, err = 0;
  setInterval(async () => {
    if (!goSocket || goSocket.readyState !== 1) return;
    try {
      const r = await page.evaluate(() => window.__captureRemote?.());
      if (!r) { if (err++ % 60 === 0) console.log('[bridge] capture: no remote video'); return; }
      if (r.error) { if (err++ % 30 === 0) console.log(`[bridge] capture: ${r.error}`); return; }
      const b64 = r.dataUrl.split(',')[1];
      if (!b64) return;
      sendToGo(Buffer.from(b64, 'base64'), ++seq);
      if (++ok % 60 === 1) console.log(`[bridge] rx←video #${ok} (${r.vw}x${r.vh})`);
    } catch (e) { if (err++ % 60 === 0) console.log(`[bridge] capture err: ${e.message}`); }
  }, Math.floor(1000 / FPS));
}

main().catch(e => { console.error('[bridge] FATAL:', e); process.exit(1); });
