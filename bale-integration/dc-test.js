const { chromium } = require('playwright');
const path = require('path');

const role = process.argv[2] || 'callee';
const target = process.argv[3] || '884923192';
const profileDir = process.argv[4] || path.join(__dirname, '..', 'bale-analysis', role === 'caller' ? 'profile-a' : 'profile-b');

const DC_HOOK = `
(function() {
  window.__dataChannels = [];
  window.__pcInstances = [];
  window.__dcMessages = 0;
  
  const origCreate = RTCPeerConnection.prototype.createDataChannel;
  RTCPeerConnection.prototype.createDataChannel = function(label, opts) {
    const dc = origCreate.call(this, label, opts);
    console.log('[DC] createDataChannel:', label, JSON.stringify(opts || {}));
    window.__dataChannels.push({ label, dc, pc: this });
    dc.addEventListener('open', () => console.log('[DC] OPEN:', label));
    dc.addEventListener('message', (e) => {
      window.__dcMessages++;
      if (window.__dcMessages % 10 === 1) {
        const size = e.data instanceof ArrayBuffer ? e.data.byteLength : e.data.length;
        console.log('[DC] MSG #' + window.__dcMessages + ':', label, 'size:', size);
      }
    });
    return dc;
  };
  
  const origPC = window.RTCPeerConnection;
  window.RTCPeerConnection = function(...args) {
    const pc = new origPC(...args);
    window.__pcInstances.push(pc);
    console.log('[DC] New PeerConnection #' + window.__pcInstances.length);
    pc.addEventListener('datachannel', (e) => {
      console.log('[DC] Remote DataChannel:', e.channel.label);
      window.__dataChannels.push({ label: e.channel.label, dc: e.channel, pc, remote: true });
      e.channel.addEventListener('message', (ev) => {
        window.__dcMessages++;
        if (window.__dcMessages % 10 === 1) {
          const size = ev.data instanceof ArrayBuffer ? ev.data.byteLength : ev.data.length;
          console.log('[DC] Remote MSG #' + window.__dcMessages + ':', e.channel.label, 'size:', size);
        }
      });
    });
    return pc;
  };
  window.RTCPeerConnection.prototype = origPC.prototype;
  Object.keys(origPC).forEach(k => { window.RTCPeerConnection[k] = origPC[k]; });
  
  console.log('[DC] Hooks installed');
})();
`;

const FAKE_CAMERA = '/tmp/qr-fake-camera.y4m';

(async () => {
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled', '--no-sandbox', '--no-proxy-server',
      '--disable-web-security', '--use-fake-device-for-media-stream',
      `--use-file-for-fake-video-capture=${FAKE_CAMERA}`,
    ],
    viewport: { width: 1280, height: 800 },
    permissions: ['camera', 'microphone'],
    ignoreHTTPSErrors: true,
  });

  const page = context.pages()[0] || await context.newPage();
  await page.addInitScript(DC_HOOK);

  page.on('console', msg => {
    if (msg.text().includes('[DC]')) console.log(msg.text());
  });

  console.log(`[test] Opening Bale as ${role}...`);
  if (role === 'caller') {
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await new Promise(r => setTimeout(r, 60000)); // Wait for login + load
    await page.goto(`https://web.bale.ai/chat?uid=${target}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  } else {
    await page.goto('https://web.bale.ai/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  }

  // Wait and log DataChannel state periodically
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const state = await page.evaluate(() => ({
      pcs: window.__pcInstances?.length || 0,
      dcs: window.__dataChannels?.map(d => ({
        label: d.label,
        state: d.dc.readyState,
        remote: !!d.remote,
      })) || [],
      msgs: window.__dcMessages || 0,
    }));
    console.log(`[test] t+${(i+1)*5}s: PCs=${state.pcs} DCs=${JSON.stringify(state.dcs)} msgs=${state.msgs}`);
    
    // If we see open DataChannels, try sending test data
    if (state.dcs.some(d => d.state === 'open' && d.label === '_reliable')) {
      console.log('[test] Found open _reliable DataChannel! Testing send...');
      const result = await page.evaluate(() => {
        const dc = window.__dataChannels.find(d => d.label === '_reliable' && d.dc.readyState === 'open');
        if (!dc) return 'not found';
        try {
          // Try sending a raw test message
          const buf = new ArrayBuffer(10);
          new Uint8Array(buf).set([1,2,3,4,5,6,7,8,9,10]);
          dc.dc.send(buf);
          return 'sent 10 bytes on _reliable';
        } catch(e) {
          return 'error: ' + e.message;
        }
      });
      console.log(`[test] Send result: ${result}`);
    }
  }
})();
