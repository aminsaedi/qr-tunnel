#!/usr/bin/env node
const { chromium } = require('playwright');
const path = require('path');

const targetUser = process.argv[2] || '884923192';
const profileDir = path.join(__dirname, 'profile-a');

async function main() {
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
  });

  const page = context.pages()[0] || await context.newPage();

  const chatUrl = `https://web.bale.ai/chat?uid=${targetUser}`;
  console.log(`Navigating to: ${chatUrl}`);
  await page.goto(chatUrl, { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 8000));

  console.log('URL:', await page.url());

  // Dump ALL interactive elements
  console.log('\n=== All interactive elements (buttons, [role=button], clickable divs) ===');
  const els = await page.$$eval('button, [role="button"], div[onclick], div[tabindex], a[href]', els => els.map(e => {
    const r = e.getBoundingClientRect();
    const cn = typeof e.className === 'string' ? e.className : (e.className?.baseVal || '');
    return {
      tag: e.tagName,
      class: cn.slice(0, 100),
      text: (e.textContent || '').trim().slice(0, 50),
      ariaLabel: e.getAttribute('aria-label'),
      title: e.getAttribute('title'),
      testId: e.getAttribute('data-testid'),
      role: e.getAttribute('role'),
      x: r.x, y: r.y, w: r.width, h: r.height,
      hasSvg: !!e.querySelector('svg'),
    };
  }).filter(e => e.w > 10 && e.h > 10));

  for (const e of els) {
    console.log(`  [${e.x.toFixed(0)},${e.y.toFixed(0)} ${e.w.toFixed(0)}x${e.h.toFixed(0)}] <${e.tag}> ${e.hasSvg?'[SVG]':''} text="${e.text}" class="${e.class}" aria="${e.ariaLabel}" title="${e.title}" testid="${e.testId}"`);
  }

  // Take a screenshot for visual reference
  await page.screenshot({ path: path.join(__dirname, 'scout-screenshot.png'), fullPage: false });
  console.log('\nScreenshot saved to bale-integration/scout-screenshot.png');

  // Also scan for any element containing phone/call/video keywords in class names
  console.log('\n=== Elements with phone/call/video in className ===');
  const callEls = await page.$$eval('*', els => {
    return els.map(e => {
      const cn = typeof e.className === 'string' ? e.className : '';
      if (/(call|phone|video|meet|voice)/i.test(cn + (e.getAttribute('aria-label')||'') + (e.getAttribute('title')||''))) {
        const r = e.getBoundingClientRect();
        return { tag: e.tagName, class: cn.slice(0,100), aria: e.getAttribute('aria-label'), title: e.getAttribute('title'), x: r.x, y: r.y, w: r.width, h: r.height };
      }
      return null;
    }).filter(Boolean).filter(e => e.w > 0);
  });
  for (const e of callEls) {
    console.log(`  [${e.x.toFixed(0)},${e.y.toFixed(0)} ${e.w.toFixed(0)}x${e.h.toFixed(0)}] <${e.tag}> class="${e.class}" aria="${e.aria}" title="${e.title}"`);
  }

  console.log('\nDone. Close browser to exit.');
  context.on('close', () => process.exit(0));
  await new Promise(() => {});
}

main().catch(e => { console.error(e); process.exit(1); });
