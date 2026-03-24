const { spawn, execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Kill anything listening on a port
function killPort(port) {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'ignore' });
  } catch {}
}

// Start the signaling server
function startSignaling(port = 3000) {
  killPort(port);
  const proc = spawn('node', [path.join(ROOT, 'test-tool', 'server.js')], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });

  let output = '';
  proc.stdout.on('data', (data) => { output += data.toString(); });
  proc.stderr.on('data', (data) => { output += data.toString(); });
  proc.getOutput = () => output;

  return new Promise((resolve, reject) => {
    const onData = (data) => {
      if (data.toString().includes('server running')) {
        resolve(proc);
      }
    };
    proc.stdout.on('data', onData);
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
    detached: true,
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
    // Check if already in output
    if (proc.getOutput && proc.getOutput().includes(pattern)) {
      resolve(proc.getOutput());
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for "${pattern}". Output so far:\n${proc.getOutput?.() || '(none)'}`));
    }, timeoutMs);

    const check = (data) => {
      if (proc.getOutput().includes(pattern)) {
        clearTimeout(timer);
        proc.stdout?.removeListener('data', check);
        proc.stderr?.removeListener('data', check);
        resolve(proc.getOutput());
      }
    };

    proc.stdout?.on('data', check);
    proc.stderr?.on('data', check);
  });
}

// Kill a process tree (detached process group)
function killProc(proc) {
  if (!proc || proc.killed) return;
  try {
    // Kill the entire process group
    process.kill(-proc.pid, 'SIGKILL');
  } catch {
    try {
      proc.kill('SIGKILL');
    } catch {}
  }
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  ROOT,
  startSignaling,
  startTunnel,
  waitForOutput,
  killProc,
  killPort,
  sleep,
};
