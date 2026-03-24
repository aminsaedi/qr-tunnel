const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Start the signaling server
function startSignaling(port = 3000) {
  const proc = spawn('node', [path.join(ROOT, 'test-tool', 'server.js')], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise((resolve, reject) => {
    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('server running')) {
        resolve(proc);
      }
    });
    proc.stderr.on('data', (data) => {
      console.error('[signaling stderr]', data.toString());
    });
    proc.on('error', reject);
    setTimeout(() => reject(new Error('signaling server startup timeout')), 10000);
  });
}

// Start a qr-tunnel binary
function startTunnel(mode, args = [], port = 3000) {
  const binary = path.join(ROOT, 'qr-tunnel');
  const fullArgs = [mode, '--signaling', `ws://localhost:${port}`, ...args];

  const proc = spawn(binary, fullArgs, {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  proc.stdout.on('data', (data) => { output += data.toString(); });
  proc.stderr.on('data', (data) => { output += data.toString(); });

  proc.getOutput = () => output;
  return proc;
}

// Wait for a string to appear in process output
function waitForOutput(proc, pattern, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for "${pattern}" in output. Got: ${proc.getOutput?.() || ''}`));
    }, timeoutMs);

    const check = (data) => {
      const str = data.toString();
      if (str.includes(pattern)) {
        clearTimeout(timer);
        resolve(str);
      }
    };

    proc.stdout?.on('data', check);
    proc.stderr?.on('data', check);
  });
}

// Kill process and all children
function killProc(proc) {
  if (proc && !proc.killed) {
    try {
      process.kill(-proc.pid, 'SIGTERM');
    } catch {
      try { proc.kill('SIGTERM'); } catch {}
    }
  }
}

module.exports = {
  ROOT,
  startSignaling,
  startTunnel,
  waitForOutput,
  killProc,
};
