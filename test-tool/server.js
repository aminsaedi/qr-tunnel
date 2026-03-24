const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// Serve static files
const server = http.createServer((req, res) => {
  let filePath;
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = ext === '.html' ? 'text/html' :
                      ext === '.js'   ? 'application/javascript' :
                      ext === '.css'  ? 'text/css' : 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// WebSocket signaling — dumb relay for exactly 2 peers
const wss = new WebSocketServer({ server });
const peers = [];

wss.on('connection', (ws) => {
  if (peers.length >= 2) {
    console.log('[signaling] rejected: already 2 peers connected');
    ws.close(4000, 'room full');
    return;
  }

  const peerIndex = peers.length;
  peers.push(ws);
  console.log(`[signaling] peer ${peerIndex} connected (${peers.length}/2)`);

  // Notify the peer of its index
  ws.send(JSON.stringify({ type: 'welcome', peerIndex, peersConnected: peers.length }));

  // Notify the other peer that a new peer joined
  const other = peers.find(p => p !== ws && p.readyState === 1);
  if (other) {
    other.send(JSON.stringify({ type: 'peer-joined', peersConnected: peers.length }));
  }

  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      console.log('[signaling] invalid JSON, ignoring');
      return;
    }

    console.log(`[signaling] peer ${peerIndex} → ${msg.type}`);

    // Relay to the other peer
    for (const peer of peers) {
      if (peer !== ws && peer.readyState === 1) {
        peer.send(data.toString());
      }
    }
  });

  ws.on('close', () => {
    const idx = peers.indexOf(ws);
    if (idx !== -1) peers.splice(idx, 1);
    console.log(`[signaling] peer ${peerIndex} disconnected (${peers.length}/2)`);

    // Notify remaining peer
    for (const peer of peers) {
      if (peer.readyState === 1) {
        peer.send(JSON.stringify({ type: 'peer-left', peersConnected: peers.length }));
      }
    }
  });

  ws.on('error', (err) => {
    console.log(`[signaling] peer ${peerIndex} error: ${err.message}`);
  });
});

server.listen(PORT, () => {
  console.log(`[signaling] server running on http://localhost:${PORT}`);
  console.log(`[signaling] WebSocket signaling on ws://localhost:${PORT}`);
});
