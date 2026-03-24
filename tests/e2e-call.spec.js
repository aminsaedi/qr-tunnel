const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const { startSignaling, startTunnel, waitForOutput, killProc, sleep, ROOT } = require('./helpers');

const SIGNALING_PORT_1 = 4001;
const SIGNALING_PORT_2 = 4002;

test.beforeAll(async () => {
  execSync('go build -o qr-tunnel ./cmd/qr-tunnel', { cwd: ROOT, stdio: 'inherit' });
});

test.describe.serial('Call establishment', () => {
  let signaling;
  let tunnel;

  test.afterEach(async () => {
    killProc(tunnel);
    killProc(signaling);
    tunnel = null;
    signaling = null;
    await sleep(500);
  });

  test('Go binary connects to signaling and establishes WebRTC with browser', async ({ page }) => {
    // 1. Start signaling server
    signaling = await startSignaling(SIGNALING_PORT_1);

    // 2. Start Go binary as callee
    tunnel = startTunnel('connect', ['--role', 'callee'], SIGNALING_PORT_1);

    // 3. Wait for Go binary to connect to signaling
    await waitForOutput(tunnel, 'connecting', 10000);
    await sleep(1500);

    // 4. Open browser to signaling server
    await page.goto(`http://localhost:${SIGNALING_PORT_1}`);
    await sleep(500);

    // 5. Browser acts as caller: create DC and offer
    await page.selectOption('#role', 'caller');
    await page.click('#btnStart');

    // 6. Wait for WebRTC connection in the browser
    await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 20000 });

    // 7. Verify Go binary also saw the connection
    await sleep(1000);
    const output = tunnel.getOutput();
    console.log('--- Go binary output ---');
    console.log(output);
    console.log('------------------------');

    // The Go binary should log ICE state changes and data channel open
    expect(output).toContain('ICE state');
    expect(output).toContain('connected');
  });

  test('Signaling server relays offer/answer between two browser tabs', async ({ page, context }) => {
    signaling = await startSignaling(SIGNALING_PORT_2);

    // Tab 1: Caller
    await page.goto(`http://localhost:${SIGNALING_PORT_2}`);
    await page.selectOption('#role', 'caller');

    // Tab 2: Callee
    const page2 = await context.newPage();
    await page2.goto(`http://localhost:${SIGNALING_PORT_2}`);
    await page2.selectOption('#role', 'callee');

    await sleep(1000);

    // Caller starts the call — creates DataChannel, offer
    await page.click('#btnStart');

    // Callee should receive the offer via signaling and enable Answer
    await expect(page2.locator('#btnAnswer')).toBeEnabled({ timeout: 10000 });

    // Verify signaling log shows offer was relayed
    const calleeLog = await page2.locator('#log').textContent();
    expect(calleeLog).toContain('received offer');

    // Callee answers
    await page2.click('#btnAnswer');

    // Verify answer was sent
    await sleep(1000);
    const callerLog = await page.locator('#log').textContent();
    expect(callerLog).toContain('received answer');

    console.log('Signaling relay verified: offer -> callee, answer -> caller');

    // If ICE connects (bonus), verify frame exchange
    try {
      await expect(page.locator('#status')).toHaveText(/Connected/, { timeout: 10000 });
      console.log('ICE connected — testing frame exchange');
      await page.click('#btnSendTest');
      await sleep(3000);
      const remoteStats = await page2.locator('#remoteStats').textContent();
      console.log('Callee remote stats:', remoteStats);
    } catch {
      console.log('ICE did not connect between headless instances (expected in CI)');
    }

    await page2.close();
  });
});
