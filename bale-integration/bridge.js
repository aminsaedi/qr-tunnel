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
let dcMode = false; // DataChannel transport mode active

// --- WS server ---
const wss = new WebSocketServer({ port: wsPort });
console.log(`[bridge] WS on :${wsPort}`);
wss.on('connection', ws => {
  console.log('[bridge] Go connected');
  goSocket = ws;
  if (callActive) ws.send('connected');
  ws.on('message', data => {
    if (data instanceof Buffer && data.length > 0 && data[0] === 0xDC) {
      // DataChannel mode: forward payload to _reliable local DC
      forwardToDC(data.slice(1));
    } else if (data instanceof Buffer && data.length > 8) {
      // Legacy bitmap mode: draw to canvas
      drawQRFrame(data);
    }
  });
  ws.on('close', () => { goSocket = null; dcMode = false; });
});

function sendToGo(jpegBuf, seq) {
  if (!goSocket || goSocket.readyState !== 1) return;
  const hdr = Buffer.alloc(8);
  hdr.writeUInt32BE(seq, 0); hdr.writeUInt16BE(720, 4); hdr.writeUInt16BE(720, 6);
  try { goSocket.send(Buffer.concat([hdr, jpegBuf])); } catch {}
}

// --- DataChannel transport ---

let dcTxCount = 0, dcRxCount = 0;

async function forwardToDC(payload) {
  if (!page) return;
  try {
    const b64 = payload.toString('base64');
    const sent = await page.evaluate((b64) => {
      const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

      if (!window.__dcSeq) window.__dcSeq = 0;
      window.__dcSeq++;

      let packetBytes;
      // Use injected LiveKit protocol SDK if available (exact SFU-compatible encoding)
      if (window.LKProto && window.LKProto.DataPacket) {
        const { DataPacket, DataPacket_Kind, UserPacket } = window.LKProto;
        const userPacket = new UserPacket({ payload: raw });
        const packet = new DataPacket({
          kind: DataPacket_Kind.RELIABLE,
          value: { case: 'user', value: userPacket },
          sequence: window.__dcSeq,
        });
        packetBytes = packet.toBinary();
      } else {
        // Fallback: manual protobuf
        function encodeVarint(v) {
          const bytes = [];
          do { bytes.push((v & 0x7f) | (v > 0x7f ? 0x80 : 0)); v >>>= 7; } while (v > 0);
          return bytes;
        }
        function field(num, wireType, data) { return [...encodeVarint((num << 3) | wireType), ...data]; }
        function fieldVarint(num, val) { return field(num, 0, encodeVarint(val)); }
        function fieldBytes(num, data) { return field(num, 2, [...encodeVarint(data.length), ...data]); }
        const userPacket = fieldBytes(2, [...raw]);
        packetBytes = new Uint8Array([
          ...fieldVarint(1, 0),
          ...fieldBytes(2, userPacket),
          ...fieldVarint(16, window.__dcSeq),
        ]);
      }

      const dc = window.__lkSendDC || (window.__dcAll || []).find(d => d.label === '_reliable' && d.dir === 'local' && d.dc.readyState === 'open')?.dc;
      if (!dc || dc.readyState !== 'open') return false;
      dc.send(packetBytes);
      // Update TX stats in same evaluate (no extra round-trip)
      const s = window.__tunnelStats;
      if (s) { s.txBytes += raw.length; s.txPkts++; s.connected = true; s.mode = 'datachannel'; if (!s.startTime) s.startTime = Date.now(); s.lastActivity = Date.now(); }
      return window.LKProto ? 'sdk' : 'manual';
    }, b64);
    if (sent) {
      dcTxCount++;
      if (dcTxCount % 100 === 1) console.log(`[DC-tx] #${dcTxCount} via ${sent} (${payload.length} bytes)`);
    } else {
      if (dcTxCount === 0) console.log('[DC-tx] no DC available, dropping');
    }
  } catch (e) {
    if (dcTxCount % 100 === 0) console.log(`[DC-tx] error: ${e.message}`);
  }
}

function sendDCToGo(payload) {
  if (!goSocket || goSocket.readyState !== 1) return;
  const header = Buffer.alloc(1, 0xDC);
  try { goSocket.send(Buffer.concat([header, Buffer.from(payload)])); } catch {}
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
      // Hook _reliable remote DC to forward tunnel data
      if (e.channel.label === '_reliable') {
        window.__dcRemoteRxTotal = 0;
        window.__dcRemoteParsed = 0;
        e.channel.addEventListener('message', (evt) => {
          window.__dcRemoteRxTotal++;
          if (!window.__dcRecvQueue) window.__dcRecvQueue = [];
          const data = evt.data;
          if (data instanceof ArrayBuffer) {
            const arr = new Uint8Array(data);
            if (window.__dcRemoteRxTotal <= 5) {
              console.log('[DC-debug] remote _reliable msg #' + window.__dcRemoteRxTotal + ' size=' + arr.length + ' first5=[' + Array.from(arr.slice(0,5)).map(b=>('0'+b.toString(16)).slice(-2)).join(',') + ']');
            }
            const payload = window.__extractLKPayload(arr);
            if (payload && payload.length > 0) {
              window.__dcRemoteParsed++;
              window.__dcRecvQueue.push(Array.from(payload));
              if (window.__dcRemoteParsed <= 3) {
                console.log('[DC-debug] parsed payload size=' + payload.length);
              }
            }
          }
        });
        console.log('[DC] hooked _reliable remote for tunnel forwarding');
      }
    });
    return pc;
  };
  window.RTCPeerConnection.prototype = _origPC.prototype;
  Object.keys(_origPC).forEach(k => { try { window.RTCPeerConnection[k] = _origPC[k]; } catch(e){} });

  // Extract payload from LiveKit DataPacket protobuf
  // DataPacket { kind(1): varint, user(2): UserPacket { payload(2): bytes } }
  window.__extractLKPayload = function(buf) {
    let i = 0;
    let userStart = -1, userEnd = -1;
    while (i < buf.length) {
      const tag = buf[i++];
      const fieldNum = tag >> 3;
      const wireType = tag & 0x07;
      if (wireType === 0) { // varint
        while (i < buf.length && buf[i] & 0x80) i++;
        i++;
      } else if (wireType === 2) { // length-delimited
        let len = 0, shift = 0;
        while (i < buf.length && buf[i] & 0x80) { len |= (buf[i++] & 0x7f) << shift; shift += 7; }
        len |= (buf[i++] & 0x7f) << shift;
        if (fieldNum === 2 && userStart === -1) { userStart = i; userEnd = i + len; }
        i += len;
      } else {
        break; // unknown wire type
      }
    }
    if (userStart < 0) return null;
    // Now parse UserPacket to find field 2 (payload)
    i = userStart;
    while (i < userEnd) {
      const tag = buf[i++];
      const fieldNum = tag >> 3;
      const wireType = tag & 0x07;
      if (wireType === 0) {
        while (i < userEnd && buf[i] & 0x80) i++;
        i++;
      } else if (wireType === 2) {
        let len = 0, shift = 0;
        while (i < userEnd && buf[i] & 0x80) { len |= (buf[i++] & 0x7f) << shift; shift += 7; }
        len |= (buf[i++] & 0x7f) << shift;
        if (fieldNum === 2) { return buf.slice(i, i + len); } // payload!
        i += len;
      } else {
        break;
      }
    }
    return null;
  };
  // === Tunnel Stats ===
  window.__tunnelStats = {
    txBytes: 0, rxBytes: 0, txPkts: 0, rxPkts: 0,
    startTime: 0, connected: false, mode: 'waiting',
    streams: 0, lastActivity: 0,
  };

  // Stats dashboard renderer — shown on the fake camera video
  window.__drawTunnelStats = function(ctx, videoOrFrame) {
    const W = 720, H = 720;
    const s = window.__tunnelStats;
    const now = Date.now();

    // Dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Animated gradient accent bar at top
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#0f3460');
    grad.addColorStop(0.5, s.connected ? '#16c784' : '#e94560');
    grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 6);

    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#e6e6e6';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('QR TUNNEL', W/2, 60);

    // Status
    ctx.font = 'bold 24px monospace';
    if (s.connected) {
      ctx.fillStyle = '#16c784';
      ctx.fillText('CONNECTED', W/2, 100);
      ctx.fillStyle = '#8892b0';
      ctx.font = '16px monospace';
      const uptime = Math.floor((now - s.startTime) / 1000);
      const m = Math.floor(uptime / 60);
      const sec = uptime % 60;
      ctx.fillText('Uptime: ' + m + 'm ' + sec + 's', W/2, 125);
    } else {
      ctx.fillStyle = '#e94560';
      ctx.fillText(s.mode === 'datachannel' ? 'DC MODE' : 'WAITING...', W/2, 100);
    }

    // Stats boxes
    const boxY = 160;
    function drawBox(x, y, w, h, label, value, unit) {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#8892b0';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + w/2, y + 22);
      ctx.fillStyle = '#e6e6e6';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(value, x + w/2, y + 58);
      ctx.fillStyle = '#8892b0';
      ctx.font = '12px monospace';
      ctx.fillText(unit, x + w/2, y + 78);
    }

    function fmtBytes(b) {
      if (b < 1024) return b + ' B';
      if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
      return (b/1024/1024).toFixed(1) + ' MB';
    }

    // Speed calc
    if (!s._lastCheck) { s._lastCheck = now; s._lastTx = 0; s._lastRx = 0; s._txSpeed = 0; s._rxSpeed = 0; }
    if (now - s._lastCheck > 1000) {
      const dt = (now - s._lastCheck) / 1000;
      s._txSpeed = (s.txBytes - s._lastTx) / dt;
      s._rxSpeed = (s.rxBytes - s._lastRx) / dt;
      s._lastCheck = now;
      s._lastTx = s.txBytes;
      s._lastRx = s.rxBytes;
    }

    const bw = 155, bh = 90, gap = 15;
    const startX = (W - 4*bw - 3*gap) / 2;

    drawBox(startX, boxY, bw, bh, 'TX DATA', fmtBytes(s.txBytes), s.txPkts + ' packets');
    drawBox(startX+bw+gap, boxY, bw, bh, 'RX DATA', fmtBytes(s.rxBytes), s.rxPkts + ' packets');
    drawBox(startX+2*(bw+gap), boxY, bw, bh, 'TX SPEED', fmtBytes(Math.round(s._txSpeed||0)) + '/s', '');
    drawBox(startX+3*(bw+gap), boxY, bw, bh, 'RX SPEED', fmtBytes(Math.round(s._rxSpeed||0)) + '/s', '');

    // Second row
    const row2Y = boxY + bh + gap;
    drawBox(startX, row2Y, bw, bh, 'MODE', s.mode === 'datachannel' ? 'DC' : s.mode, s.mode === 'datachannel' ? 'DataChannel' : '');
    drawBox(startX+bw+gap, row2Y, bw, bh, 'STREAMS', '' + s.streams, 'active');

    // Activity indicator
    const active = s.lastActivity && (now - s.lastActivity) < 2000;
    ctx.fillStyle = active ? '#16c784' : '#3a3a5c';
    ctx.beginPath();
    ctx.arc(W - 30, 30, 8, 0, Math.PI * 2);
    ctx.fill();

    // Footer
    ctx.fillStyle = '#3a3a5c';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('github.com/aminsaedi/qr-tunnel', W/2, H - 15);
  };

  // Hook RTCDataChannel.send to capture LiveKit's _reliable DC send function
  const _origDCSend = RTCDataChannel.prototype.send;
  window.__lkSendDC = null;
  RTCDataChannel.prototype.send = function(data) {
    if (this.label === '_reliable' && !window.__lkSendDC) {
      window.__lkSendDC = this;
      console.log('[DC] captured _reliable DC reference via send hook');
    }
    return _origDCSend.call(this, data);
  };

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

          // Always draw stats dashboard on the canvas
          window.__drawTunnelStats(ctx, videoFrame);

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
      // Set contentHint to 'detail' — tells VP9 to use screen-content mode
      // which preserves sharp block edges much better than camera mode
      generator.contentHint = 'detail';

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
        window.__drawTunnelStats(ctx, video.readyState >= 2 ? video : null);
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

  // Inject LiveKit protocol bundle for correct DataPacket serialization
  try {
    const lkBundle = require('fs').readFileSync(path.join(__dirname, 'lk-protocol-bundle.js'), 'utf8');
    await page.addInitScript(lkBundle);
    console.log('[bridge] LiveKit protocol bundle injected');
  } catch (e) {
    console.log('[bridge] LiveKit protocol bundle not found, using manual protobuf');
  }

  // Forward page console messages with [DC] prefix
  page.on('console', msg => {
    if (msg.text().includes('[DC]')) console.log(msg.text());
  });

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

  // Install DataChannel receive handler AFTER call connects
  // (init script hooks may miss LiveKit's PeerConnections that load before our hooks)
  await setupDCReceiver(page);

  // Log DataChannel state + probe for LiveKit SDK every 10 seconds
  setInterval(async () => {
    try {
      const info = await page.evaluate(() => {
        const dcState = (window.__dcAll || []).map(d => ({
          label: d.label, dir: d.dir, state: d.dc.readyState
        }));

        // Probe for LiveKit SDK objects (DataPacket, Room, etc.)
        let lkFound = [];
        // Search all script-accessible globals and module caches
        function searchObj(obj, path, depth) {
          if (depth > 3 || !obj || typeof obj !== 'object') return;
          try {
            for (const key of Object.getOwnPropertyNames(obj).slice(0, 100)) {
              try {
                const v = obj[key];
                if (typeof v === 'function' && (key === 'DataPacket' || key === 'UserPacket')) {
                  lkFound.push(path + '.' + key);
                }
                if (v && typeof v === 'object' && v.localParticipant && typeof v.localParticipant.publishData === 'function') {
                  lkFound.push(path + '.' + key + ' (Room with publishData!)');
                }
                if (v && typeof v === 'function' && v.name === 'Room' && v.prototype?.localParticipant !== undefined) {
                  lkFound.push(path + '.' + key + ' (Room constructor)');
                }
              } catch(e) {}
            }
          } catch(e) {}
        }
        searchObj(window, 'window', 0);
        // Check webpack chunks
        try {
          const chunks = window.webpackChunk || window.webpackChunkbale_web || window.webpackChunk_N_E || [];
          lkFound.push('webpackChunks: ' + chunks.length);
        } catch(e) {}

        // Check for __lkSendDC (send hook)
        const sendDC = window.__lkSendDC ? 'captured' : 'null';

        return { dcState, lkFound, sendDC, dcSeq: window.__dcSeq || 0 };
      });
      if (info.dcState.length > 0) {
        console.log('[DC-state]', JSON.stringify(info.dcState));
      }
      if (info.lkFound.length > 0) {
        console.log('[LK-probe]', JSON.stringify(info.lkFound));
      }
      console.log(`[DC-info] sendDC=${info.sendDC} dcSeq=${info.dcSeq}`);
    } catch {}
  }, 10000);

  // Poll for DataChannel receive queue (remote DC → Go)
  // We poll at high frequency to minimize latency
  setInterval(async () => {
    if (!goSocket || goSocket.readyState !== 1 || !page) return;
    try {
      const messages = await page.evaluate(() => {
        if (!window.__dcRecvQueue || window.__dcRecvQueue.length === 0) return null;
        const msgs = window.__dcRecvQueue;
        window.__dcRecvQueue = [];
        // Update RX stats in the same evaluate call (no extra round-trip)
        let bytes = 0;
        for (const m of msgs) bytes += m.length;
        const s = window.__tunnelStats;
        if (s) { s.rxBytes += bytes; s.rxPkts += msgs.length; s.connected = true; s.mode = 'datachannel'; if (!s.startTime) s.startTime = Date.now(); s.lastActivity = Date.now(); }
        return msgs;
      });
      if (messages && messages.length > 0) {
        for (const msg of messages) {
          sendDCToGo(Buffer.from(msg));
          dcRxCount++;
        }
        if (dcRxCount % 100 < messages.length) {
          console.log(`[DC-rx] total=${dcRxCount}, batch=${messages.length}`);
        }
      }
    } catch {}
  }, 10); // 10ms polling — low latency for DataChannel data

  process.on('SIGINT', async () => { wss.close(); await context.close(); process.exit(0); });
  await new Promise(() => {});
}

// === Interactive Call Automation ===
// If any step fails, prompts the user to do it manually instead of crashing.

const readline = require('readline');

async function askUser(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    console.log('');
    console.log('┌──────────────────────────────────────────────┐');
    console.log(`│  ${prompt.padEnd(44)} │`);
    console.log('│  Press ENTER when done (or type "skip")      │');
    console.log('└──────────────────────────────────────────────┘');
    rl.question('> ', answer => { rl.close(); resolve(answer.trim().toLowerCase()); });
  });
}

async function doCaller(page) {
  console.log('[bridge] Click video call...');
  try { const b = await page.waitForSelector('[data-testid="video-"]', { timeout: 5000 }); await b.click(); } catch {}
  await sleep(2000);
  await findAndClick(page, ['Start Call'], 15000);
  await sleep(3000);
  await waitForCall(page);
}

async function doCallee(page) {
  console.log('[bridge] Waiting for call...');
  await findAndClick(page, ['Answer'], 300000);
  await sleep(2000);
  await findAndClick(page, ['Answer Call', 'Start Call'], 15000);
  await sleep(3000);
  await waitForCall(page);
}

async function dumpPageState(page, label) {
  try {
    await page.screenshot({ path: `/tmp/bale-${label}.png` });
    const buttons = await page.evaluate(() => {
      const results = [];
      for (const el of document.querySelectorAll('button, [role="button"], a[href], div[onclick]')) {
        const r = el.getBoundingClientRect();
        if (r.width < 5 || r.height < 5) continue;
        results.push({
          tag: el.tagName, text: (el.textContent || '').trim().slice(0, 60),
          cls: (el.className || '').slice(0, 60),
          tid: el.getAttribute('data-testid'),
          pos: `${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`
        });
      }
      return results;
    });
    console.log(`[dump:${label}] screenshot: /tmp/bale-${label}.png`);
    console.log(`[dump:${label}] ${buttons.length} buttons:`);
    for (const b of buttons.slice(0, 20)) {
      console.log(`  [${b.tag}] "${b.text}" cls="${b.cls}" tid=${b.tid} @${b.pos}`);
    }
  } catch (e) {
    console.log(`[dump:${label}] error: ${e.message}`);
  }
}

async function waitForCall(page) {
  console.log('[bridge] Waiting for call to connect...');
  for (let i = 0; i < 45; i++) {
    try {
      const n = await page.evaluate(() =>
        Array.from(document.querySelectorAll('video'))
          .filter(v => !v.paused && v.readyState >= 2 && v.videoWidth > 10).length
      );
      if (i % 5 === 0) console.log(`[bridge] ${n} active video(s)`);
      if (n >= 2) {
        console.log('[bridge] *** CALL ACTIVE ***');
        callActive = true;
        if (goSocket) goSocket.send('connected');
        return;
      }
    } catch {}
    await sleep(2000);
  }

  // Timeout — ask user
  console.log('[bridge] Call detection timed out after 90s');
  const answer = await askUser('Is the video call active? (press Enter if yes, "retry" to keep waiting)');
  if (answer === 'retry') {
    return waitForCall(page);
  }
  console.log('[bridge] Proceeding (user confirmed)');
  callActive = true;
  if (goSocket) goSocket.send('connected');
}

// Find and click a button by text content. Returns true if clicked.
// Uses the ORIGINAL proven method: find text, walk up to first reasonable parent, click center.
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
      if (pos) { console.log(`[bridge] click "${text}" at (${Math.round(pos.x)},${Math.round(pos.y)})`); await page.mouse.click(pos.x, pos.y); return true; }
    }
    await sleep(500);
  }
  return false;
}

// Try clicking elements by CSS selector. Returns true if clicked.
async function tryClickBySelector(page, selectors) {
  for (const sel of selectors) {
    try {
      const el = await page.$(sel);
      if (el) {
        const box = await el.boundingBox();
        if (box && box.width > 10 && box.height > 10) {
          await el.click();
          console.log(`[bridge] click selector: ${sel}`);
          return true;
        }
      }
    } catch {}
  }
  return false;
}

async function setupDCReceiver(pg) {
  const result = await pg.evaluate(() => {
    if (!window.__dcRecvQueue) window.__dcRecvQueue = [];
    let found = 0;

    // Hook remote _reliable DC message handler
    for (const entry of (window.__dcAll || [])) {
      if (entry.label === '_reliable' && entry.dir === 'remote' && entry.dc.readyState === 'open') {
        if (entry._tunnelHooked) continue;
        entry._tunnelHooked = true;
        entry.dc.addEventListener('message', (evt) => {
          if (evt.data instanceof ArrayBuffer) {
            const arr = new Uint8Array(evt.data);
            let payload = null;
            // Use SDK decoder if available
            if (window.LKProto && window.LKProto.DataPacket) {
              try {
                const dp = window.LKProto.DataPacket.fromBinary(arr);
                if (dp.value?.case === 'user' && dp.value.value?.payload) {
                  payload = dp.value.value.payload;
                }
              } catch(e) { /* not a valid DataPacket */ }
            }
            // Fallback: manual parser
            if (!payload) {
              payload = window.__extractLKPayload ? window.__extractLKPayload(arr) : null;
            }
            if (payload && payload.length > 0) {
              window.__dcRecvQueue.push(Array.from(payload));
            }
          }
        });
        found++;
      }
    }

    // Find LiveKit Room for publishData
    // LiveKit SDK stores Room references — search common patterns
    let lkRoom = null;
    // Method 1: Check global scope
    for (const key of Object.keys(window)) {
      try {
        const obj = window[key];
        if (obj && obj.localParticipant && typeof obj.localParticipant.publishData === 'function') {
          lkRoom = obj;
          break;
        }
      } catch(e) {}
    }
    // Method 2: Search webpack modules
    if (!lkRoom) {
      try {
        const wc = window.webpackChunk || window.webpackChunkbale_web || [];
        for (const chunk of wc) {
          if (!chunk[1]) continue;
          for (const mod of Object.values(chunk[1])) {
            try {
              const m = { exports: {} };
              mod(m, m.exports, () => null);
              if (m.exports?.localParticipant?.publishData) { lkRoom = m.exports; break; }
            } catch(e) {}
          }
          if (lkRoom) break;
        }
      } catch(e) {}
    }

    if (lkRoom) {
      window.__lkRoom = lkRoom;
      window.__lkPublish = (b64) => {
        const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        lkRoom.localParticipant.publishData(raw, { reliable: true, topic: 'tunnel' });
      };
      return { found, lkRoom: true, identity: lkRoom.localParticipant?.identity || '?' };
    }

    return { found, lkRoom: false };
  });

  console.log(`[DC-setup] result: ${JSON.stringify(result)}`);

  if (result.lkRoom) {
    console.log('[DC-setup] LiveKit Room found! Using publishData API for sending.');
  }
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
