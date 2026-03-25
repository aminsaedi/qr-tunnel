// Launch both browsers, user makes a call, then inspect video elements
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching Browser A (caller)...');
  const ctxA = await chromium.launchPersistentContext(path.join(__dirname, 'profile-a'), {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--use-fake-ui-for-media-stream'],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
  });
  const pageA = ctxA.pages()[0] || await ctxA.newPage();

  console.log('Launching Browser B (callee)...');
  const ctxB = await chromium.launchPersistentContext(path.join(__dirname, 'profile-b'), {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--use-fake-ui-for-media-stream'],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
  });
  const pageB = ctxB.pages()[0] || await ctxB.newPage();

  // Add labels
  await pageA.goto('https://web.bale.ai/chat?uid=884923192', { waitUntil: 'domcontentloaded' });
  await pageB.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3000));

  await pageA.evaluate(() => {
    const b = document.createElement('div');
    b.textContent = 'A — CALLER (click video call button + Start Call)';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#e74c3c;color:#fff;text-align:center;font:bold 16px sans-serif;padding:4px 0;pointer-events:none;';
    document.body.appendChild(b);
  });
  await pageB.evaluate(() => {
    const b = document.createElement('div');
    b.textContent = 'B — CALLEE (answer when it rings)';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;background:#2ecc71;color:#fff;text-align:center;font:bold 16px sans-serif;padding:4px 0;pointer-events:none;';
    document.body.appendChild(b);
  });

  console.log('');
  console.log('Both browsers open.');
  console.log('1. Click video call (camera icon) in RED browser');
  console.log('2. Click "Start Call"');
  console.log('3. Answer on GREEN browser');
  console.log('');
  console.log('Polling for video elements on both pages...');

  // Poll both pages for video elements
  setInterval(async () => {
    for (const [name, page] of [['A', pageA], ['B', pageB]]) {
      try {
        const info = await page.evaluate(() => {
          const videos = document.querySelectorAll('video');
          return Array.from(videos).map((v, i) => ({
            i,
            vw: v.videoWidth, vh: v.videoHeight,
            cw: v.clientWidth, ch: v.clientHeight,
            paused: v.paused,
            ready: v.readyState,
            time: v.currentTime.toFixed(1),
            hasSrc: !!v.srcObject,
            tracks: v.srcObject ? v.srcObject.getTracks().map(t => `${t.kind}:${t.readyState}${t.muted?':muted':''}`).join(',') : '',
            rect: v.getBoundingClientRect(),
          }));
        });
        if (info.length > 0) {
          for (const v of info) {
            console.log(`[${name}] video[${v.i}] native=${v.vw}x${v.vh} css=${v.cw}x${v.ch} paused=${v.paused} ready=${v.ready} time=${v.time} srcObj=${v.hasSrc} tracks=[${v.tracks}] pos=[${Math.round(v.rect.x)},${Math.round(v.rect.y)} ${Math.round(v.rect.width)}x${Math.round(v.rect.height)}]`);
          }
        }
      } catch {}
    }
  }, 3000);

  // Keep alive
  process.on('SIGINT', async () => {
    await ctxA.close();
    await ctxB.close();
    process.exit(0);
  });
  await new Promise(() => {});
})();
