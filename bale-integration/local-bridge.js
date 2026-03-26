#!/usr/bin/env node
// Simple local bridge: passes frames between two Go binaries via WebSocket
// No Bale, no browser — just WS relay. For testing the Go↔Node.js path.
const { WebSocketServer } = require('ws');

const portA = parseInt(process.argv[2] || '9000');
const portB = parseInt(process.argv[3] || '9001');

let clientA = null, clientB = null;
let rxA = 0, rxB = 0, txA = 0, txB = 0;

// Bridge A (client side)
const wssA = new WebSocketServer({ port: portA });
console.log(`[bridge-A] WS on :${portA}`);
wssA.on('connection', ws => {
  clientA = ws;
  console.log('[bridge-A] Go connected');
  ws.send('connected');
  ws.on('message', data => {
    txA++;
    // Forward bitmap frames to B (simulates video call)
    if (clientB && clientB.readyState === 1 && data instanceof Buffer && data.length > 8) {
      clientB.send(data);
      rxB++;
    }
  });
  ws.on('close', () => { clientA = null; console.log('[bridge-A] Go disconnected'); });
});

// Bridge B (server side)
const wssB = new WebSocketServer({ port: portB });
console.log(`[bridge-B] WS on :${portB}`);
wssB.on('connection', ws => {
  clientB = ws;
  console.log('[bridge-B] Go connected');
  ws.send('connected');
  ws.on('message', data => {
    txB++;
    // Forward bitmap frames to A
    if (clientA && clientA.readyState === 1 && data instanceof Buffer && data.length > 8) {
      clientA.send(data);
      rxA++;
    }
  });
  ws.on('close', () => { clientB = null; console.log('[bridge-B] Go disconnected'); });
});

// Stats every 5s
setInterval(() => {
  console.log(`[stats] A→B: ${txA} sent, ${rxB} received | B→A: ${txB} sent, ${rxA} received`);
}, 5000);

process.on('SIGINT', () => { wssA.close(); wssB.close(); process.exit(0); });
