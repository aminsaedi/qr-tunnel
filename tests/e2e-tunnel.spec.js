const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const { startSignaling, startTunnel, waitForOutput, killProc, killPort, sleep, ROOT } = require('./helpers');

const SIGNALING_PORT_1 = 4005;
const SIGNALING_PORT_2 = 4006;
const GUI_PORT = 4086;

test.beforeAll(async () => {
  execSync('go build -o qr-tunnel ./cmd/qr-tunnel', { cwd: ROOT, stdio: 'inherit' });
});

test.describe.serial('Tunnel connectivity', () => {
  let signaling;
  let server;
  let client;

  test.afterEach(async () => {
    killProc(client);
    killProc(server);
    killProc(signaling);
    client = null;
    server = null;
    signaling = null;
    await sleep(500);
  });

  test('Two Go binaries connect through signaling server', async () => {
    signaling = await startSignaling(SIGNALING_PORT_1);

    // Start server (callee)
    server = startTunnel('connect', ['--role', 'callee'], SIGNALING_PORT_1);
    await waitForOutput(server, 'connecting', 10000);
    await sleep(2000);

    // Start client (caller)
    client = startTunnel('connect', ['--role', 'caller'], SIGNALING_PORT_1);
    await waitForOutput(client, 'connecting', 10000);

    // Wait for WebRTC connection
    await sleep(8000);

    const serverOut = server.getOutput();
    const clientOut = client.getOutput();

    console.log('--- Server output ---');
    console.log(serverOut);
    console.log('--- Client output ---');
    console.log(clientOut);

    // Both should have gone through ICE negotiation
    expect(serverOut).toContain('ICE state');
    expect(clientOut).toContain('ICE state');

    // At least one should report connected (both create PC, offer/answer exchanged)
    const eitherConnected = serverOut.includes('connected') || clientOut.includes('connected');
    expect(eitherConnected).toBe(true);
  });

  test('Web UI serves dashboard and returns metrics via API', async ({ page }) => {
    signaling = await startSignaling(SIGNALING_PORT_2);
    killPort(GUI_PORT);

    // Start Go binary with GUI
    server = startTunnel('connect', ['--role', 'callee', '--gui', `:${GUI_PORT}`], SIGNALING_PORT_2);
    await waitForOutput(server, 'webui', 10000);
    await sleep(1000);

    // Load the dashboard
    await page.goto(`http://localhost:${GUI_PORT}/`);
    await sleep(1000);

    // Verify the dashboard renders
    const title = await page.title();
    expect(title).toContain('qr-tunnel');

    // Verify the dashboard has expected elements
    await expect(page.locator('h1')).toHaveText(/qr-tunnel/);
    await expect(page.locator('#webrtcState')).toBeVisible();

    // Test the metrics API endpoint
    const response = await page.request.get(`http://localhost:${GUI_PORT}/api/metrics`);
    expect(response.status()).toBe(200);
    const metrics = await response.json();
    console.log('Metrics API response:', JSON.stringify(metrics, null, 2));

    expect(metrics).toHaveProperty('webrtcState');
    expect(metrics).toHaveProperty('txRate');
    expect(metrics).toHaveProperty('qrVersion');
    expect(metrics.qrVersion).toBe(25);

    // Test the SimLab page
    await page.goto(`http://localhost:${GUI_PORT}/simlab`);
    await sleep(500);
    await expect(page.locator('h1')).toHaveText(/qr-tunnel/);

    // Test the sim API
    const simResponse = await page.request.get(`http://localhost:${GUI_PORT}/api/sim`);
    expect(simResponse.status()).toBe(200);
    const simData = await simResponse.json();
    console.log('Sim API response:', simData);
    expect(simData).toHaveProperty('dropRate');

    // POST to sim API
    const postResponse = await page.request.post(`http://localhost:${GUI_PORT}/api/sim`, {
      data: { dropRate: 30, noisePct: 10, delayMs: 100 },
    });
    expect(postResponse.status()).toBe(200);

    // Verify it took effect
    const simData2 = await (await page.request.get(`http://localhost:${GUI_PORT}/api/sim`)).json();
    expect(simData2.dropRate).toBe(30);
    expect(simData2.noisePct).toBe(10);
    expect(simData2.delayMs).toBe(100);

    console.log('Web UI + SimLab API: all checks passed');
  });
});
