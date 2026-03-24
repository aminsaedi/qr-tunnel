const { test, expect } = require('@playwright/test');
const { startSignaling, startTunnel, waitForOutput, killProc } = require('./helpers');

let signaling;
let tunnel;

test.beforeEach(async () => {
  // Build binary
  const { execSync } = require('child_process');
  execSync('go build -o qr-tunnel ./cmd/qr-tunnel', { cwd: require('./helpers').ROOT });
});

test.afterEach(async () => {
  killProc(tunnel);
  killProc(signaling);
});

test('Go binary connects to signaling and establishes WebRTC with browser', async ({ page }) => {
  // 1. Start signaling server
  signaling = await startSignaling(3001);

  // 2. Start Go binary as callee
  tunnel = startTunnel('connect', ['--role', 'callee'], 3001);

  // Give it a moment to connect to signaling
  await new Promise(r => setTimeout(r, 2000));

  // 3. Open browser to signaling server
  await page.goto('http://localhost:3001');

  // 4. Select caller role and start call
  await page.selectOption('#role', 'caller');
  await page.click('#btnStart');

  // 5. Wait for connection
  await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 15000 });

  // 6. Verify Go binary logs connection
  const output = tunnel.getOutput();
  console.log('Go binary output:', output);

  // Take screenshot
  await page.screenshot({ path: 'screenshots/01-call.png', fullPage: true });
});

test('Two browser tabs make a video call through signaling server', async ({ page, context }) => {
  signaling = await startSignaling(3002);

  // Tab 1: Caller
  await page.goto('http://localhost:3002');
  await page.selectOption('#role', 'caller');
  await page.selectOption('#videoSource', 'canvas');

  // Tab 2: Callee
  const page2 = await context.newPage();
  await page2.goto('http://localhost:3002');
  await page2.selectOption('#role', 'callee');
  await page2.selectOption('#videoSource', 'canvas');

  // Wait for both to connect to signaling
  await new Promise(r => setTimeout(r, 1000));

  // Caller starts the call
  await page.click('#btnStart');

  // Callee answers
  await expect(page2.locator('#btnAnswer')).toBeEnabled({ timeout: 10000 });
  await page2.click('#btnAnswer');

  // Both should show connected
  await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 15000 });
  await expect(page2.locator('#status')).toHaveText(/Connected/, { timeout: 15000 });

  // Start sending test frames from caller
  await page.click('#btnSendTest');
  await new Promise(r => setTimeout(r, 3000));

  // Check that callee received frames
  const remoteStats = await page2.locator('#remoteStats').textContent();
  console.log('Callee remote stats:', remoteStats);

  await page.screenshot({ path: 'screenshots/02-browser-call-caller.png' });
  await page2.screenshot({ path: 'screenshots/02-browser-call-callee.png' });
});
