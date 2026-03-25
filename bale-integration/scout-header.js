const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const ctx = await chromium.launchPersistentContext(path.join(__dirname, 'profile-a'), {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://web.bale.ai/chat?uid=884923192', { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 6000));

  // Scan header area of chat panel (top 60px, right side x>450)
  console.log('=== Chat header elements (top-right icons) ===');
  const els = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.y < 60 && r.x > 450 && r.width > 10 && r.width < 100 && r.height > 10 && r.height < 100) {
        const cn = typeof e.className === 'string' ? e.className : '';
        results.push({
          tag: e.tagName,
          cls: cn.slice(0, 80),
          aria: e.getAttribute('aria-label'),
          title: e.getAttribute('title'),
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
          html: e.outerHTML.slice(0, 300),
        });
      }
    });
    return results;
  });

  for (const e of els) {
    console.log(`[${e.x},${e.y} ${e.w}x${e.h}] <${e.tag}> aria="${e.aria}" title="${e.title}"`);
    console.log(`  html: ${e.html}\n`);
  }

  // Also look for the specific phone/call SVG icon
  console.log('=== SVG elements with call-related aria labels ===');
  const svgs = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('svg').forEach(svg => {
      const aria = svg.getAttribute('aria-label') || '';
      const parent = svg.parentElement;
      const r = parent.getBoundingClientRect();
      if (r.width > 0) {
        results.push({
          aria: aria,
          parentTag: parent.tagName,
          parentClass: (typeof parent.className === 'string' ? parent.className : '').slice(0, 80),
          x: Math.round(r.x), y: Math.round(r.y),
          w: Math.round(r.width), h: Math.round(r.height),
          parentClickable: !!(parent.onclick || parent.getAttribute('role') === 'button' || parent.tabIndex >= 0),
        });
      }
    });
    return results;
  });

  for (const s of svgs) {
    console.log(`SVG aria="${s.aria}" parent=<${s.parentTag}> class="${s.parentClass}" [${s.x},${s.y} ${s.w}x${s.h}] clickable=${s.parentClickable}`);
  }

  await ctx.close();
})();
