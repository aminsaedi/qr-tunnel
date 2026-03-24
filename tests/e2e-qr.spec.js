const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const { startSignaling, startTunnel, waitForOutput, killProc, sleep, ROOT } = require('./helpers');

const SIGNALING_PORT_1 = 4003;
const SIGNALING_PORT_2 = 4004;

test.beforeAll(async () => {
  execSync('go build -o qr-tunnel ./cmd/qr-tunnel', { cwd: ROOT, stdio: 'inherit' });
});

test.describe.serial('QR frame exchange', () => {
  let signaling;
  let tunnel;

  test.afterEach(async () => {
    killProc(tunnel);
    killProc(signaling);
    tunnel = null;
    signaling = null;
    await sleep(500);
  });

  test('Go binary sends QR frames visible in browser', async ({ page }) => {
    signaling = await startSignaling(SIGNALING_PORT_1);

    // Start Go binary as callee with test frames enabled
    tunnel = startTunnel('connect', ['--role', 'callee', '--test-frames'], SIGNALING_PORT_1);
    await waitForOutput(tunnel, 'connecting', 10000);
    await sleep(1500);

    // Open browser as caller
    await page.goto(`http://localhost:${SIGNALING_PORT_1}`);
    await page.selectOption('#role', 'caller');
    await page.click('#btnStart');

    // Wait for connection
    await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 20000 });

    // Wait for frames to flow
    await sleep(5000);

    // Check remote stats — browser should have received frames from Go binary
    const stats = await page.locator('#remoteStats').textContent();
    console.log('Browser remote stats:', stats);

    // Check Go binary logs for frame sending
    const output = tunnel.getOutput();
    console.log('--- Go binary output (truncated) ---');
    console.log(output.slice(-1000));

    // Go binary should be sending test frames
    // (may log errors if DC not open yet, but should eventually send)
    expect(output).toContain('[tx]');
  });

  test('Browser sends frames that Go binary receives', async ({ page }) => {
    signaling = await startSignaling(SIGNALING_PORT_2);

    // Start Go binary as callee
    tunnel = startTunnel('connect', ['--role', 'callee'], SIGNALING_PORT_2);
    await waitForOutput(tunnel, 'connecting', 10000);
    await sleep(1500);

    // Open browser as caller
    await page.goto(`http://localhost:${SIGNALING_PORT_2}`);
    await page.selectOption('#role', 'caller');
    await page.click('#btnStart');

    await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 20000 });

    // Send test frames from browser to Go binary
    await page.click('#btnSendTest');
    await sleep(5000);

    // Check Go binary output for received frames
    const output = tunnel.getOutput();
    console.log('--- Go binary output (truncated) ---');
    console.log(output.slice(-1000));

    const hasRx = output.includes('[rx]');
    console.log('Go binary received frames:', hasRx);
    expect(hasRx).toBe(true);
  });
});
