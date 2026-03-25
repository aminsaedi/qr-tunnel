// Diagnostic: Launch Bale, make a call, inspect all video elements during the call
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  // Use profile-b (callee) which should already be logged in
  const ctx = await chromium.launchPersistentContext(path.join(__dirname, 'profile-b'), {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--use-fake-ui-for-media-stream'],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
  });

  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));

  console.log('=== Bale loaded. Start a call TO this account from another device. ===');
  console.log('=== Answer the call manually when it rings. ===');
  console.log('=== Once the call is active, press Enter here to inspect video elements. ===');

  // Poll for video elements every 2 seconds
  setInterval(async () => {
    try {
      const info = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        return Array.from(videos).map((v, i) => ({
          index: i,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight,
          clientWidth: v.clientWidth,
          clientHeight: v.clientHeight,
          paused: v.paused,
          readyState: v.readyState,
          currentTime: v.currentTime,
          hasSrcObject: !!v.srcObject,
          srcObjectTracks: v.srcObject ? v.srcObject.getTracks().map(t => ({
            kind: t.kind,
            id: t.id.slice(0, 20),
            enabled: t.enabled,
            readyState: t.readyState,
            muted: t.muted,
          })) : [],
          src: v.src ? v.src.slice(0, 80) : '(none)',
          className: (typeof v.className === 'string' ? v.className : '').slice(0, 60),
          parentClass: (typeof v.parentElement?.className === 'string' ? v.parentElement.className : '').slice(0, 60),
          style: v.getAttribute('style')?.slice(0, 80) || '',
          rect: {
            x: Math.round(v.getBoundingClientRect().x),
            y: Math.round(v.getBoundingClientRect().y),
            w: Math.round(v.getBoundingClientRect().width),
            h: Math.round(v.getBoundingClientRect().height),
          },
        }));
      });

      if (info.length > 0) {
        console.log(`\n--- ${info.length} video elements found ---`);
        for (const v of info) {
          console.log(`Video[${v.index}]: ${v.videoWidth}x${v.videoHeight} (CSS: ${v.clientWidth}x${v.clientHeight})`);
          console.log(`  paused=${v.paused} readyState=${v.readyState} currentTime=${v.currentTime.toFixed(1)}`);
          console.log(`  hasSrcObject=${v.hasSrcObject} tracks=${JSON.stringify(v.srcObjectTracks)}`);
          console.log(`  rect=[${v.rect.x},${v.rect.y} ${v.rect.w}x${v.rect.h}]`);
          console.log(`  class="${v.className}" parent="${v.parentClass}"`);
          console.log(`  style="${v.style}"`);
        }
      } else {
        process.stdout.write('.');
      }
    } catch {}
  }, 2000);

  // Keep alive
  ctx.on('close', () => process.exit(0));
  await new Promise(() => {});
})();
