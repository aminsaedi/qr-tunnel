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
const autoAnswer = args.includes('--auto-answer');
// Login wait: how long to wait for manual Bale login (seconds, default 60)
const loginWait = parseInt(args.find((_, i, a) => a[i - 1] === '--login-wait') || '60');
// Force login wait: always show countdown even if already logged in
const forceLoginWait = args.includes('--force-login-wait');
const FPS = 20; // Higher capture rate for bitmap codec
const FAKE_CAMERA = process.platform === 'win32'
  ? path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'qr-fake-camera.y4m')
  : '/tmp/qr-fake-camera.y4m';
const CANVAS_W = 1280, CANVAS_H = 720; // 16:9 real webcam ratio — prevents SFU downscale

console.log(`[bridge] role=${role} target=${targetUser} ws=${wsPort} autoAnswer=${autoAnswer}`);

let goSocket = null, page = null, callActive = false;
let dcMode = false; // DataChannel transport mode active

// --- WS server ---
const wss = new WebSocketServer({ port: wsPort });
console.log(`[bridge] WS on :${wsPort}`);

// Write ready file so start scripts can poll instead of sleeping a fixed time.
// Written immediately — qr-tunnel can connect and wait for 'connected' message.
const READY_FILE = `/tmp/qr-bridge-${wsPort}.ready`;
try { require('fs').writeFileSync(READY_FILE, String(process.pid)); } catch {}
const _cleanupReady = () => { try { require('fs').unlinkSync(READY_FILE); } catch {} };
process.on('exit', _cleanupReady);
process.on('SIGINT', () => { _cleanupReady(); process.exit(0); });
process.on('SIGTERM', () => { _cleanupReady(); process.exit(0); });
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
  hdr.writeUInt32BE(seq, 0); hdr.writeUInt16BE(1280, 4); hdr.writeUInt16BE(720, 6);
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
  const buf = typeof payload === 'string' ? Buffer.from(payload, 'base64') : Buffer.from(payload);
  try { goSocket.send(Buffer.concat([header, buf])); } catch {}
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
              window.__dcRecvQueue.push(window.__u8toB64(payload));
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

  // Fast Uint8Array→base64 (avoids per-byte JSON serialization through page.evaluate)
  window.__u8toB64 = function(arr) {
    const C = 8192;
    let s = '';
    for (let i = 0; i < arr.length; i += C) {
      s += String.fromCharCode.apply(null, arr.subarray(i, Math.min(i + C, arr.length)));
    }
    return btoa(s);
  };

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
    peakTx: 0, peakRx: 0,
    txHistory: new Array(60).fill(0),
    rxHistory: new Array(60).fill(0),
    _histIdx: 0,
  };

  // Stats dashboard renderer — shown as the local camera feed during the call
  window.__drawTunnelStats = function(ctx, videoOrFrame) {
    const W = 1280, H = 720;
    const s = window.__tunnelStats;
    const now = Date.now();

    // ── Background ──
    // ── Background ── (solid fill + scattered random rects for VP9 entropy)
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);
    // Scatter random dark patches — cheap but changes every frame
    for (let i = 0; i < 15; i++) {
      ctx.fillStyle = 'rgb(' + ((Math.random()*18+5)|0) + ',' + ((Math.random()*18+5)|0) + ',' + ((Math.random()*25+8)|0) + ')';
      ctx.fillRect(Math.random()*W|0, Math.random()*H|0, 40+(Math.random()*80|0), 25+(Math.random()*50|0));
    }

    // ── Helpers ──
    function fmtBytes(b) {
      if (!b || b < 1) return '0 B';
      if (b < 1024) return b.toFixed(0) + ' B';
      if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
      return (b / 1024 / 1024).toFixed(2) + ' MB';
    }
    function fmtSpeed(bps) {
      if (!bps || bps < 1) return '0 B/s';
      if (bps < 1024) return bps.toFixed(0) + ' B/s';
      if (bps < 1024 * 1024) return (bps / 1024).toFixed(1) + ' KB/s';
      return (bps / 1024 / 1024).toFixed(2) + ' MB/s';
    }

    // ── Speed sampling — update every 1s ──
    if (!s._lastCheck) {
      s._lastCheck = now; s._lastTx = 0; s._lastRx = 0;
      s._txSpeed = 0; s._rxSpeed = 0;
    }
    if (now - s._lastCheck >= 1000) {
      const dt = (now - s._lastCheck) / 1000;
      s._txSpeed = Math.max(0, (s.txBytes - s._lastTx) / dt);
      s._rxSpeed = Math.max(0, (s.rxBytes - s._lastRx) / dt);
      s._lastTx = s.txBytes; s._lastRx = s.rxBytes; s._lastCheck = now;
      s._histIdx = ((s._histIdx || 0) + 1) % 60;
      // Add baseline noise when idle — keeps sparklines animated to prevent VP9 downscale
      s.txHistory[s._histIdx] = s._txSpeed > 0 ? s._txSpeed : Math.random() * 200;
      s.rxHistory[s._histIdx] = s._rxSpeed > 0 ? s._rxSpeed : Math.random() * 200;
      s.peakTx = Math.max(s.peakTx || 0, s._txSpeed);
      s.peakRx = Math.max(s.peakRx || 0, s._rxSpeed);
    }
    const staleSec = s.lastActivity ? (now - s.lastActivity) / 1000 : 999;

    // ── Animated color bar at top ── (8px blocks, moves with time)
    for (let x = 0; x < W; x += 8) {
      const hue = (x * 0.3 + now * 0.05) % 360;
      ctx.fillStyle = 'hsl(' + hue + ',' + (s.connected ? 60 : 25) + '%,' + (s.connected ? 30 : 15) + '%)';
      ctx.fillRect(x, 0, 8, 5);
    }

    // ── HEADER: Title + mode badge + status + uptime ──
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e6edf3';
    ctx.font = 'bold 38px monospace';
    ctx.fillText('QR TUNNEL', W / 2, 55);

    // Mode badge pill
    const modeLabel = s.mode === 'datachannel' ? '⚡ DataChannel' : s.mode === 'bitmap' ? '▦ Bitmap' : '⏳ Waiting';
    ctx.fillStyle = s.mode === 'datachannel' ? '#1a7f37' : s.mode === 'bitmap' ? '#7d4e00' : '#21262d';
    ctx.fillRect(W / 2 - 90, 64, 180, 24);
    ctx.fillStyle = s.mode === 'datachannel' ? '#3fb950' : s.mode === 'bitmap' ? '#d29922' : '#8b949e';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(modeLabel, W / 2, 81);

    // Connection status
    ctx.fillStyle = s.connected ? '#3fb950' : '#f85149';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(s.connected ? '● CONNECTED' : '● ' + (s.mode || 'WAITING').toUpperCase(), W / 2, 114);

    // Uptime
    const uptime = s.startTime ? Math.floor((now - s.startTime) / 1000) : 0;
    const um = Math.floor(uptime / 60), us = uptime % 60;
    ctx.fillStyle = '#8b949e';
    ctx.font = '13px monospace';
    ctx.fillText('Uptime: ' + um + 'm ' + us + 's', W / 2, 133);

    // Connection quality bar (fades as data goes stale)
    const quality = s.connected ? Math.max(0, 1 - staleSec / 30) : 0;
    ctx.fillStyle = '#21262d';
    ctx.fillRect(40, 144, W - 80, 7);
    if (quality > 0.01) {
      const qGrad = ctx.createLinearGradient(40, 0, W - 40, 0);
      qGrad.addColorStop(0, '#238636');
      qGrad.addColorStop(Math.min(quality, 0.99), quality > 0.5 ? '#3fb950' : quality > 0.2 ? '#d29922' : '#f85149');
      qGrad.addColorStop(1, '#21262d');
      ctx.fillStyle = qGrad;
      ctx.fillRect(40, 144, (W - 80) * quality, 7);
    }
    ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
    ctx.strokeRect(40, 144, W - 80, 7);

    // ── SPEED GRAPHS ──
    const gX = 40, gW = W - 80;

    function drawSparkline(gx, gy, gw, gh, histData, idx, barColor) {
      const N = histData.length;
      const barW = gw / N;
      ctx.fillStyle = '#0d1117';
      ctx.fillRect(gx, gy, gw, gh);
      // 50% gridline
      ctx.strokeStyle = '#21262d'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, gy + gh / 2); ctx.lineTo(gx + gw, gy + gh / 2); ctx.stroke();
      const peak = Math.max(...histData, 1);
      for (let i = 0; i < N; i++) {
        const di = (idx - N + 1 + i + N) % N;
        const bh = Math.round((histData[di] / peak) * gh);
        if (bh < 1) continue;
        ctx.globalAlpha = 0.3 + 0.7 * (i / (N - 1));
        ctx.fillStyle = barColor;
        ctx.fillRect(gx + i * barW, gy + gh - bh, Math.max(1, barW - 1), bh);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#30363d';
      ctx.strokeRect(gx, gy, gw, gh);
    }

    // TX
    const txLabelY = 168, txGraphY = txLabelY + 8, txGraphH = 65;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3fb950'; ctx.font = 'bold 13px monospace';
    ctx.fillText('↑ TX', gX, txLabelY);
    ctx.fillStyle = '#6e7681'; ctx.font = '11px monospace';
    ctx.fillText('peak ' + fmtSpeed(s.peakTx || 0), gX + 50, txLabelY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 16px monospace';
    ctx.fillText(fmtSpeed(s._txSpeed || 0), gX + gW, txLabelY);
    drawSparkline(gX, txGraphY, gW, txGraphH, s.txHistory || new Array(60).fill(0), s._histIdx || 0, '#2ea043');

    // RX
    const rxLabelY = txGraphY + txGraphH + 18, rxGraphY = rxLabelY + 8, rxGraphH = 65;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#58a6ff'; ctx.font = 'bold 13px monospace';
    ctx.fillText('↓ RX', gX, rxLabelY);
    ctx.fillStyle = '#6e7681'; ctx.font = '11px monospace';
    ctx.fillText('peak ' + fmtSpeed(s.peakRx || 0), gX + 50, rxLabelY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 16px monospace';
    ctx.fillText(fmtSpeed(s._rxSpeed || 0), gX + gW, rxLabelY);
    drawSparkline(gX, rxGraphY, gW, rxGraphH, s.rxHistory || new Array(60).fill(0), s._histIdx || 0, '#1f6feb');

    // ── STATS BOXES — 2 rows of 4 ──
    const boxY1 = rxGraphY + rxGraphH + 18;
    const bw = 155, bh = 80, bgap = 13;
    const bsX = (W - 4 * bw - 3 * bgap) / 2;

    function drawBox(bx, by, bww, bhh, lbl, val, sub, accent) {
      ctx.fillStyle = '#161b22'; ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(bx, by, bww, bhh, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = accent || '#30363d';
      ctx.fillRect(bx, by, bww, 3);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8b949e'; ctx.font = '11px monospace';
      ctx.fillText(lbl, bx + bww / 2, by + 17);
      ctx.fillStyle = '#e6edf3'; ctx.font = 'bold 19px monospace';
      ctx.fillText(val, bx + bww / 2, by + 46);
      ctx.fillStyle = '#6e7681'; ctx.font = '11px monospace';
      ctx.fillText(sub || '', bx + bww / 2, by + 65);
    }

    // Row 1: TX total | RX total | Streams | Last data
    const upSec = s.startTime ? (now - s.startTime) / 1000 : 0;
    const avgTx = upSec > 5 ? s.txBytes / upSec : 0;
    const avgRx = upSec > 5 ? s.rxBytes / upSec : 0;
    const lastDataStr = staleSec < 2 ? 'now' : (staleSec < 60 ? staleSec.toFixed(0) + 's ago' : '>1m ago');
    const lastDataAccent = staleSec < 5 ? '#238636' : staleSec < 15 ? '#d29922' : '#f85149';

    drawBox(bsX,              boxY1, bw, bh, 'TX TOTAL', fmtBytes(s.txBytes), s.txPkts + ' packets', '#238636');
    drawBox(bsX+bw+bgap,      boxY1, bw, bh, 'RX TOTAL', fmtBytes(s.rxBytes), s.rxPkts + ' packets', '#1f6feb');
    drawBox(bsX+2*(bw+bgap),  boxY1, bw, bh, 'STREAMS',  String(s.streams || 0), 'active', '#8957e5');
    drawBox(bsX+3*(bw+bgap),  boxY1, bw, bh, 'LAST DATA', lastDataStr, staleSec < 2 ? 'data flowing' : 'idle', lastDataAccent);

    // Row 2: Peak TX | Peak RX | Avg TX | Avg RX
    const boxY2 = boxY1 + bh + bgap;
    drawBox(bsX,              boxY2, bw, bh, 'PEAK TX',  fmtSpeed(s.peakTx || 0), 'max seen', '#2ea043');
    drawBox(bsX+bw+bgap,      boxY2, bw, bh, 'PEAK RX',  fmtSpeed(s.peakRx || 0), 'max seen', '#1f6feb');
    drawBox(bsX+2*(bw+bgap),  boxY2, bw, bh, 'AVG TX',   fmtSpeed(avgTx), 'session avg', '#6e7681');
    drawBox(bsX+3*(bw+bgap),  boxY2, bw, bh, 'AVG RX',   fmtSpeed(avgRx), 'session avg', '#6e7681');

    // ── Data stall warning banner ──
    if (staleSec > 12 && s.connected) {
      const warnY = boxY2 + bh + 12;
      ctx.fillStyle = 'rgba(218,54,51,0.15)'; ctx.strokeStyle = '#f85149'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(40, warnY, W - 80, 30, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f85149'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
      ctx.fillText('⚠  DATA STALL — heartbeat will disconnect at 15s', W / 2, warnY + 20);
    }

    // ── Pulsing activity dot ──
    const isActive = s.lastActivity && staleSec < 2;
    const pulse = isActive ? (0.65 + 0.35 * Math.sin(now / 200)) : 1;
    ctx.globalAlpha = pulse;
    ctx.fillStyle = isActive ? '#3fb950' : (s.connected ? '#d29922' : '#30363d');
    ctx.beginPath(); ctx.arc(W - 25, 25, 8, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // ══════════════════════════════════════════════════════════════
    // ── ANTI-VP9 DOWNSCALE ──
    // Must be lightweight! Heavy drawing blocks Chrome's JS main thread
    // which prevents DC message forwarding → heartbeat dies.
    // Strategy: cheap ops that change many pixels per frame.
    // ══════════════════════════════════════════════════════════════

    // 1. Noise strip (8px blocks = fast, full width, changes every frame)
    const noiseY = H - 48;
    for (let x = 0; x < W; x += 8) {
      ctx.fillStyle = 'rgb(' + ((Math.random()*50+10)|0) + ',' + ((Math.random()*40+10)|0) + ',' + ((Math.random()*60+15)|0) + ')';
      ctx.fillRect(x, noiseY, 8, 20);
    }

    // 2. Edge noise (left + right columns, changes every frame)
    for (let y = 0; y < H; y += 8) {
      ctx.fillStyle = 'rgb(' + ((Math.random()*30+8)|0) + ',' + ((Math.random()*25+8)|0) + ',' + ((Math.random()*40+12)|0) + ')';
      ctx.fillRect(0, y, 6, 8);
      ctx.fillRect(W - 6, y, 6, 8);
    }

    // 3. Scrolling ticker (one fillText, cheap but moves every frame)
    const tickerY = noiseY + 22;
    ctx.fillStyle = '#0a0d12';
    ctx.fillRect(0, tickerY, W, 14);
    ctx.fillStyle = '#4a5060'; ctx.font = '11px monospace'; ctx.textAlign = 'left';
    const tickText = '  ●  QR-TUNNEL  ●  DataChannel proxy via Bale  ●  SOCKS5 :1080  ●  HTTP :8080  ●  aminsaedi/qr-tunnel  ';
    const tickOff = -(now / 25) % (tickText.length * 6.6);
    ctx.fillText(tickText + tickText, tickOff, tickerY + 11);

    // 4. Footer with frame counter + clock
    ctx.fillStyle = '#010409';
    ctx.fillRect(0, H - 12, W, 12);
    ctx.fillStyle = '#4a4f5a'; ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(' F:' + (window.__frameN || 0), 2, H - 2);
    ctx.textAlign = 'center';
    ctx.fillText('qr-tunnel v5', W / 2, H - 2);
    ctx.textAlign = 'right';
    const sec = Math.floor(now / 1000) % 60;
    const min = Math.floor(now / 60000) % 60;
    ctx.fillText((min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec, W - 3, H - 2);
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
      c.width = 1280; c.height = 720;
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

          // Pass through the fake camera feed directly — testsrc2 is already
          // animated (color bars, clock) which prevents VP9 downscale.
          // Drawing on canvas at 1280x720 blocks the main thread and kills DC.
          // Stats are shown as HTML overlay instead.
          controller.enqueue(videoFrame);
        }
      });

      processor.readable.pipeThrough(transformer).pipeTo(generator.writable);

      // Build output stream: transformed video + real audio
      // Don't set contentHint='detail' — that triggers VP9 screen-share mode
      // which aggressively downscales when content appears static.
      // Leave unset so encoder treats it as normal camera feed.

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
      window.__captureCanvas.width = 1280; window.__captureCanvas.height = 720;
      window.__captureCtx = window.__captureCanvas.getContext('2d');
    }
    try {
      window.__captureCtx.drawImage(v, 0, 0, 1280, 720);
      return { dataUrl: window.__captureCanvas.toDataURL('image/png'), vw: v.videoWidth, vh: v.videoHeight };
    } catch(e) { return { error: e.message }; }
  };
})();
`;

// Detect whether the user is already logged in to Bale.
// Returns 'app' (logged in), 'login' (login page), or 'unknown' (ambiguous).
async function detectLoginState(page) {
  await sleep(4000); // Let page settle after domcontentloaded
  try {
    return await page.evaluate(() => {
      // Login page has a phone number input
      if (document.querySelector('input[type="tel"]')) return 'login';
      if (document.querySelector('input[type="number"]')) return 'login';
      // Login page: Persian prompts for phone / OTP
      const text = document.body ? document.body.innerText : '';
      if (text.includes('شماره موبایل') || text.includes('کد تأیید') || text.includes('ورود به بله')) return 'login';
      // App: chat sidebar has several data-testid elements
      if (document.querySelectorAll('[data-testid]').length >= 3) return 'app';
      return 'unknown';
    });
  } catch {
    return 'unknown';
  }
}

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
  // Use system Chrome — CLI flag takes priority, then env var
  const chromePath = args.find((_, i, a) => a[i - 1] === '--chrome') || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (chromePath) {
    launchOpts.executablePath = chromePath;
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
    // Open Bale homepage first, then detect login state
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });

    let doWait = forceLoginWait;
    if (!forceLoginWait) {
      process.stdout.write('[bridge] Checking login state...\n');
      const state = await detectLoginState(page);
      if (state === 'app') {
        console.log('[bridge] Already logged in — skipping login wait');
        doWait = false;
      } else if (state === 'login') {
        console.log(`[bridge] Login page detected — waiting ${loginWait}s for manual login`);
        doWait = true;
      } else {
        console.log(`[bridge] Login state unclear — waiting ${loginWait}s to be safe`);
        doWait = true;
      }
    } else {
      console.log(`[bridge] --force-login-wait: waiting ${loginWait}s`);
    }

    if (doWait) {
      for (let sec = loginWait; sec > 0; sec--) {
        process.stdout.write(`\r[bridge] Navigating to chat in ${sec}s... (log in to Bale if needed) `);
        await sleep(1000);
      }
      process.stdout.write('\r[bridge] Navigating to chat...                                      \n');
    }

    await page.goto(`https://web.bale.ai/chat?uid=${targetUser}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  } else {
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  }
  await sleep(10000);

  // Label + stats overlay (HTML-based, doesn't affect video pipeline)
  const color = role === 'caller' ? '#e74c3c' : '#2ecc71';
  const label = role === 'caller' ? `CALLER → ${targetUser}` : 'SERVER (auto-answer)';
  await page.evaluate(({c,l}) => {
    const d = document.createElement('div');
    d.textContent = l; d.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:999999;background:${c};color:#fff;text-align:center;font:bold 15px sans-serif;padding:3px 0;pointer-events:none;opacity:0.85;`;
    document.body.appendChild(d);

    // Stats overlay panel
    const panel = document.createElement('div');
    panel.id = 'tunnel-stats';
    panel.style.cssText = 'position:fixed;bottom:5px;left:5px;z-index:999999;background:rgba(0,0,0,0.8);color:#e6edf3;font:12px monospace;padding:8px 12px;border-radius:6px;pointer-events:none;max-width:300px;';
    panel.innerHTML = 'Tunnel: waiting...';
    document.body.appendChild(panel);

    // Update stats overlay every second
    setInterval(() => {
      const s = window.__tunnelStats;
      if (!s) return;
      function fmt(b) { return b < 1024 ? b + 'B' : b < 1048576 ? (b/1024).toFixed(1) + 'KB' : (b/1048576).toFixed(1) + 'MB'; }
      function spd(b) { return b < 1024 ? b.toFixed(0) + 'B/s' : (b/1024).toFixed(1) + 'KB/s'; }
      const up = s.startTime ? Math.floor((Date.now() - s.startTime) / 1000) : 0;
      panel.innerHTML = (s.connected ? '● CONNECTED' : '○ ' + s.mode) +
        ' | ↑' + fmt(s.txBytes) + ' ↓' + fmt(s.rxBytes) +
        '<br>Speed: ↑' + spd(s._txSpeed||0) + ' ↓' + spd(s._rxSpeed||0) +
        ' | Streams: ' + (s.streams||0) +
        '<br>Uptime: ' + Math.floor(up/60) + 'm' + (up%60) + 's | F:' + (window.__frameN||0);
    }, 1000);
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

  // Log DC state once at startup (avoid repeated page.evaluate that competes with DC)
  setTimeout(async () => {
    try {
      const info = await page.evaluate(() => {
        const dcState = (window.__dcAll || []).map(d => ({
          label: d.label, dir: d.dir, state: d.dc.readyState
        }));
        const sendDC = window.__lkSendDC ? 'captured' : 'null';
        return { dcState, sendDC, dcSeq: window.__dcSeq || 0 };
      });
      console.log('[DC-state]', JSON.stringify(info.dcState));
      console.log('[DC-info] sendDC=' + info.sendDC + ' dcSeq=' + info.dcSeq);
    } catch {}
  }, 5000);

  // Poll for DataChannel receive queue (remote DC → Go)
  // Uses sequential async loop to avoid piling up page.evaluate calls
  async function dcPollLoop() {
    while (true) {
      if (!goSocket || goSocket.readyState !== 1 || !page) {
        await sleep(10);
        continue;
      }
      try {
        const messages = await page.evaluate(() => {
          if (!window.__dcRecvQueue || window.__dcRecvQueue.length === 0) return null;
          const msgs = window.__dcRecvQueue;
          window.__dcRecvQueue = [];
          // Update RX stats — msgs are base64 strings, estimate real bytes
          let bytes = 0;
          for (const m of msgs) bytes += Math.floor(m.length * 3 / 4);
          const s = window.__tunnelStats;
          if (s) { s.rxBytes += bytes; s.rxPkts += msgs.length; s.connected = true; s.mode = 'datachannel'; if (!s.startTime) s.startTime = Date.now(); s.lastActivity = Date.now(); }
          return msgs;
        });
        if (messages && messages.length > 0) {
          for (const msg of messages) {
            sendDCToGo(msg); // msg is already base64, sendDCToGo handles decoding
            dcRxCount++;
          }
          if (dcRxCount % 100 < messages.length) {
            console.log(`[DC-rx] total=${dcRxCount}, batch=${messages.length}`);
          }
          await sleep(1); // brief yield, then poll again immediately (data was flowing)
        } else {
          await sleep(5); // no data, back off slightly
        }
      } catch {
        await sleep(10);
      }
    }
  }
  dcPollLoop(); // fire-and-forget — runs until process exits

  async function shutdown() { try { wss.close(); } catch {} try { await context.close(); } catch {} process.exit(0); }
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
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
  let clicked = false;
  try { const b = await page.waitForSelector('[data-testid="video-"]', { timeout: 10000 }); await b.click(); clicked = true; } catch {}
  if (!clicked) {
    console.log('[bridge] Could not find video call button automatically.');
    await askUser('Please click the VIDEO CALL button (camera icon, top right)');
  }
  await sleep(2000);

  let started = await findAndClick(page, ['Start Call'], 20000);
  if (!started) {
    console.log('[bridge] Could not find Start Call button automatically.');
    await askUser('Please click START CALL in the dialog');
  }
  await sleep(3000);
  await waitForCall(page);
}

async function doCallee(page) {
  // Phase 1: Detect incoming call (wait for "Answer" text to appear)
  console.log('[bridge] Monitoring for incoming calls...');

  // Poll for incoming call notification
  let callDetected = false;
  for (let i = 0; i < 6000; i++) { // up to ~50 min
    const hasCall = await page.evaluate(() => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const t = w.currentNode.textContent.trim();
        if (t === 'Answer' || t === 'Decline' || t === 'پاسخ' || t === 'رد') return true;
      }
      return false;
    }).catch(() => false);

    if (hasCall) {
      // Notify via stdout (the CLI script reads this)
      console.log('[bridge] INCOMING_CALL_DETECTED');
      callDetected = true;
      break;
    }
    await sleep(500);
  }

  if (!callDetected) {
    console.log('[bridge] No call received (timeout)');
    return;
  }

  // Phase 2: Answer the call (auto or wait for approval)
  if (autoAnswer) {
    console.log('[bridge] Auto-answering...');
    await answerCall(page);
  } else {
    // Wait for ANSWER_NOW command from stdin (the CLI script sends it)
    console.log('[bridge] WAITING_FOR_APPROVAL');
    await new Promise(resolve => {
      const handler = (data) => {
        const cmd = data.toString().trim();
        if (cmd === 'ANSWER_NOW') {
          process.stdin.removeListener('data', handler);
          resolve();
        } else if (cmd === 'DECLINE') {
          process.stdin.removeListener('data', handler);
          // Just ignore the call — it'll ring out
          resolve();
          return;
        }
      };
      process.stdin.on('data', handler);
      // Auto-answer after 30s if no response (call will drop otherwise)
      setTimeout(() => { process.stdin.removeListener('data', handler); resolve(); }, 30000);
    });
    console.log('[bridge] Answering call...');
    await answerCall(page);
  }

  await waitForCall(page);
}

async function answerCall(page) {
  // Click "Answer" button
  let answered = await findAndClick(page, ['Answer'], 5000);
  if (!answered) {
    console.log('[bridge] ANSWER_FAILED — could not find Answer button');
    console.log('[bridge] Please answer the call manually in the browser window');
    // Wait for manual answer (detect video playing)
    for (let i = 0; i < 30; i++) {
      const vids = await page.evaluate(() =>
        Array.from(document.querySelectorAll('video'))
          .filter(v => !v.paused && v.readyState >= 2 && v.videoWidth > 10).length
      ).catch(() => 0);
      if (vids >= 1) break;
      await sleep(2000);
    }
    return;
  }
  await sleep(2000);

  // Click confirm ("Answer Call" / "Start Call")
  let confirmed = await findAndClick(page, ['Answer Call', 'Start Call'], 15000);
  if (!confirmed) {
    console.log('[bridge] CONFIRM_FAILED — could not find confirm button');
    console.log('[bridge] Please confirm the call manually in the browser window');
  }
  await sleep(3000);
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
              window.__dcRecvQueue.push(window.__u8toB64(payload));
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
  // Skip video frame capture — all data goes through DataChannel now.
  // Frame capture at 20fps wastes CPU + page.evaluate calls that compete with DC forwarding.
  // Only needed for legacy bitmap mode which is no longer used.
  console.log('[bridge] Skipping video frame capture (DC mode — not needed)');
  return;
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
