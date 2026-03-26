// Diagnostic: make a call, capture frames from both sides, check what's actually being transmitted
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const INIT = `
(function() {
  window.__videoSenders = [];
  // Hook getSenders to discover video senders
  const origGS = RTCPeerConnection.prototype.getSenders;
  RTCPeerConnection.prototype.getSenders = function() {
    const s = origGS.call(this);
    for (const x of s) {
      if (x.track?.kind === 'video' && !window.__videoSenders.includes(x)) {
        window.__videoSenders.push(x);
        console.log('[diag] found video sender, total:', window.__videoSenders.length);
      }
    }
    return s;
  };
  // Also hook addTransceiver
  const origAT = RTCPeerConnection.prototype.addTransceiver;
  RTCPeerConnection.prototype.addTransceiver = function(t, init) {
    const tr = origAT.call(this, t, init);
    if ((typeof t === 'string' ? t : t?.kind) === 'video' && tr.sender) {
      window.__videoSenders.push(tr.sender);
      console.log('[diag] sender via addTransceiver, total:', window.__videoSenders.length);
    }
    return tr;
  };
})();
`;

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
              if (r.width > 30 && r.height > 25 && r.y > 100)
                return { x: r.x + r.width / 2, y: r.y + r.height / 2, text: t };
              el = el.parentElement;
            }
          }
        }
        return null;
      }, text);
      if (pos) {
        console.log(`  click: "${pos.text}" at (${Math.round(pos.x)},${Math.round(pos.y)})`);
        await page.mouse.click(pos.x, pos.y);
        return true;
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function captureAndSave(page, name) {
  const info = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('video'));
    return vids.map((v, i) => ({
      i, vw: v.videoWidth, vh: v.videoHeight,
      paused: v.paused, ready: v.readyState,
      cssW: Math.round(v.getBoundingClientRect().width),
      cssH: Math.round(v.getBoundingClientRect().height),
    }));
  });
  console.log(`[${name}] videos:`, JSON.stringify(info));

  // Capture each video to a file
  const vids = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('video'))
      .filter(v => !v.paused && v.readyState >= 2 && v.videoWidth > 10)
      .map((v, i) => {
        const c = document.createElement('canvas');
        c.width = v.videoWidth; c.height = v.videoHeight;
        try {
          c.getContext('2d').drawImage(v, 0, 0);
          return { i, vw: v.videoWidth, vh: v.videoHeight, data: c.toDataURL('image/png') };
        } catch (e) {
          return { i, vw: v.videoWidth, vh: v.videoHeight, error: e.message };
        }
      });
  });

  for (const v of vids) {
    if (v.data) {
      const buf = Buffer.from(v.data.split(',')[1], 'base64');
      const fname = `/tmp/diag-${name}-video${v.i}-${v.vw}x${v.vh}.png`;
      fs.writeFileSync(fname, buf);
      console.log(`[${name}] saved ${fname} (${buf.length} bytes)`);
    } else {
      console.log(`[${name}] video${v.i}: ${v.error}`);
    }
  }

  // Check senders
  const senders = await page.evaluate(() =>
    (window.__videoSenders || []).map(s => ({
      hasTrack: !!s.track, kind: s.track?.kind,
      label: s.track?.label?.slice(0, 40),
      state: s.track?.readyState,
      settings: s.track?.getSettings?.(),
    }))
  );
  console.log(`[${name}] senders:`, JSON.stringify(senders));
}

(async () => {
  const args = ['--no-sandbox', '--disable-web-security', '--disable-site-isolation-trials',
    '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=/tmp/qr-fake-camera.y4m'];

  console.log('Launching callee (B)...');
  const ctxB = await chromium.launchPersistentContext(path.join(__dirname, 'profile-b'), {
    headless: false, args, viewport: { width: 1280, height: 800 }, permissions: ['camera', 'microphone'],
  });
  const pageB = ctxB.pages()[0] || await ctxB.newPage();
  await pageB.addInitScript(INIT);
  await pageB.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));

  console.log('Launching caller (A)...');
  const ctxA = await chromium.launchPersistentContext(path.join(__dirname, 'profile-a'), {
    headless: false, args, viewport: { width: 1280, height: 800 }, permissions: ['camera', 'microphone'],
  });
  const pageA = ctxA.pages()[0] || await ctxA.newPage();
  await pageA.addInitScript(INIT);
  await pageA.goto('https://web.bale.ai/chat?uid=884923192', { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 5000));

  // Make the call
  console.log('\n--- Starting call ---');
  try {
    const btn = await pageA.waitForSelector('[data-testid="video-"]', { timeout: 5000 });
    await btn.click();
  } catch { console.log('video button not found'); }
  await new Promise(r => setTimeout(r, 2000));
  await findAndClick(pageA, ['Start Call']);
  await new Promise(r => setTimeout(r, 3000));

  console.log('Answering...');
  await findAndClick(pageB, ['Answer']);
  await new Promise(r => setTimeout(r, 2000));
  await findAndClick(pageB, ['Answer Call', 'Start Call']);

  console.log('\nWaiting 20s for call to stabilize...');
  await new Promise(r => setTimeout(r, 20000));

  // Capture diagnostics
  console.log('\n--- CAPTURING DIAGNOSTICS ---');
  await captureAndSave(pageA, 'A');
  await captureAndSave(pageB, 'B');

  console.log('\nDone. Closing...');
  await ctxA.close();
  await ctxB.close();
})();
