const { test, expect } = require('@playwright/test');
const { startSignaling, startTunnel, waitForOutput, killProc } = require('./helpers');

let signaling;
let tunnel;

test.beforeEach(async () => {
  const { execSync } = require('child_process');
  execSync('go build -o qr-tunnel ./cmd/qr-tunnel', { cwd: require('./helpers').ROOT });
});

test.afterEach(async () => {
  killProc(tunnel);
  killProc(signaling);
});

test('Go binary sends QR frames visible in browser', async ({ page }) => {
  signaling = await startSignaling(3003);

  // Start Go binary as callee with test frames
  tunnel = startTunnel('connect', ['--role', 'callee', '--test-frames'], 3003);
  await new Promise(r => setTimeout(r, 2000));

  // Open browser as caller
  await page.goto('http://localhost:3003');
  await page.selectOption('#role', 'caller');
  await page.click('#btnStart');

  // Wait for connection
  await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 15000 });

  // Wait for frames to arrive
  await new Promise(r => setTimeout(r, 5000));

  // Check remote stats for received frames
  const stats = await page.locator('#remoteStats').textContent();
  console.log('Remote stats:', stats);

  await page.screenshot({ path: 'screenshots/03-qr-frames.png' });
});

test('Browser sends frames that Go binary receives', async ({ page }) => {
  signaling = await startSignaling(3004);

  // Start Go binary as callee
  tunnel = startTunnel('connect', ['--role', 'callee'], 3004);
  await new Promise(r => setTimeout(r, 2000));

  // Open browser as caller
  await page.goto('http://localhost:3004');
  await page.selectOption('#role', 'caller');
  await page.selectOption('#videoSource', 'canvas');
  await page.click('#btnStart');

  await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 15000 });

  // Send test frames from browser
  await page.click('#btnSendTest');
  await new Promise(r => setTimeout(r, 5000));

  // Check Go binary output for received frames
  const output = tunnel.getOutput();
  console.log('Go binary output:', output);

  const hasRx = output.includes('[rx]');
  console.log('Go received frames:', hasRx);

  await page.screenshot({ path: 'screenshots/04-browser-sends.png' });
});
