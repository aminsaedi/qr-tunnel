#!/usr/bin/env node
// QR Tunnel Server CLI — monitors Bale for incoming calls with interactive control
const { spawn, execSync } = require('child_process');
const https = require('https');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node serve-cli.js [options]

QR Tunnel Server — opens Bale, monitors for incoming video calls,
and provides internet access to callers via SOCKS5/HTTP proxy.

Options:
  --auto-answer, -a       Answer calls automatically (default: prompt)
  --disable-health-check  Skip Bale availability monitoring
  --help, -h              Show this help

Examples:
  node serve-cli.js                     Interactive — prompts per call
  node serve-cli.js --auto-answer       Auto-answer for background/tmux
  node serve-cli.js -a --disable-health-check   Auto-answer, no health check
`);
  process.exit(0);
}

const autoAnswer = process.argv.includes('--auto-answer') || process.argv.includes('-a');
const healthCheckDisabled = process.argv.includes('--disable-health-check');
const projectDir = path.resolve(__dirname);
const profileDir = path.join(projectDir, 'bale-analysis', 'profile-b');
const bridgeScript = path.join(projectDir, 'bale-integration', 'bridge.js');
const tunnelBin = path.join(projectDir, 'qr-tunnel');

// Colors
const C = {
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
};

console.log('');
console.log(C.bold(C.cyan('╔══════════════════════════════════════════════╗')));
console.log(C.bold(C.cyan('║       QR Tunnel Server (Exit Node)           ║')));
console.log(C.bold(C.cyan('║  Provides internet via Bale video calls       ║')));
console.log(C.bold(C.cyan('╚══════════════════════════════════════════════╝')));
console.log('');
console.log(autoAnswer
  ? C.green('  Mode: AUTO-ANSWER — calls answered automatically')
  : C.yellow('  Mode: INTERACTIVE — you approve each call'));
console.log(healthCheckDisabled
  ? C.dim('  Health check: disabled')
  : C.green('  Health check: enabled (monitoring web.bale.ai)'));
console.log('');

// Ensure prerequisites
if (!fs.existsSync(path.join(profileDir, 'Default'))) {
  console.log(C.red('ERROR: Bale profile not found at ' + profileDir));
  process.exit(1);
}

// Create fake camera if needed
const fakeCam = '/tmp/qr-fake-camera.y4m';
if (!fs.existsSync(fakeCam)) {
  console.log('Creating fake camera file...');
  const { execSync } = require('child_process');
  try {
    execSync(`ffmpeg -y -f lavfi -i "testsrc2=size=1280x720:rate=30" -t 120 -pix_fmt yuv420p ${fakeCam} 2>/dev/null`);
  } catch {}
}

// === Bale Health Checker ===
// Monitors web.bale.ai with exponential backoff.
// More aggressive during Iran business hours (7AM-6PM Tehran = UTC+3:30).
// Only kills session after 1+ minute of continuous unavailability.
class BaleHealthChecker {
  constructor() {
    this.healthy = false;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.checkInterval = 15000;
    this.timer = null;
    this.onHealthChange = null;
    this.lastCheck = null;
    this.firstFailTime = null; // timestamp of first failure in current streak
    this.totalChecks = 0;
  }

  // Tehran is UTC+3:30
  _isTehranBusinessHours() {
    const now = new Date();
    const tehranHour = (now.getUTCHours() + 3 + (now.getUTCMinutes() + 30 >= 60 ? 1 : 0)) % 24;
    return tehranHour >= 7 && tehranHour < 18;
  }

  _getMaxInterval() {
    return this._isTehranBusinessHours() ? 120000 : 600000; // 2min biz hours, 10min off hours
  }

  _getMinInterval() {
    return this._isTehranBusinessHours() ? 15000 : 30000; // 15s biz, 30s off
  }

  async check() {
    this.totalChecks++;
    // Use a lightweight HEAD request to avoid Bale rate-limiting full page fetches.
    // Also try DNS resolution as fallback — if DNS works, Bale infra is up.
    return new Promise((resolve) => {
      const req = https.request('https://web.bale.ai/', {
        method: 'HEAD',
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      }, (res) => {
        res.resume();
        // Any response (even 403/429) means Bale server is reachable
        resolve(true);
      });
      req.on('error', (err) => {
        // Connection reset / ECONNREFUSED means network-level block
        // But DNS resolution success means Bale infra is up (ISP might be blocking TLS)
        const dns = require('dns');
        dns.resolve4('web.bale.ai', (dnsErr) => {
          resolve(!dnsErr); // DNS works = Bale is up (just TLS blocked)
        });
      });
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    });
  }

  async start() {
    if (healthCheckDisabled) { this.healthy = true; return; }
    await this._doCheck();
    this._schedule();
  }

  stop() { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }

  _schedule() {
    this.timer = setTimeout(async () => {
      if (stopping) return;
      await this._doCheck();
      this._schedule();
    }, this.checkInterval);
  }

  async _doCheck() {
    const ok = await this.check();
    this.lastCheck = new Date();
    const wasHealthy = this.healthy;
    const bizHours = this._isTehranBusinessHours();
    const tag = bizHours ? '☀' : '🌙';

    if (ok) {
      this.consecutiveFailures = 0;
      this.consecutiveSuccesses++;
      this.firstFailTime = null;
      this.healthy = true;
      this.checkInterval = this._getMinInterval();

      if (!wasHealthy) {
        console.log(C.green(`  [health] ${tag} ✓ Bale is UP (${this.lastCheck.toLocaleTimeString()})`));
        if (this.onHealthChange) this.onHealthChange(true);
      }
    } else {
      this.consecutiveSuccesses = 0;
      this.consecutiveFailures++;
      if (!this.firstFailTime) this.firstFailTime = Date.now();
      const downDuration = Date.now() - this.firstFailTime;
      const downSec = Math.round(downDuration / 1000);

      // Exponential backoff capped by time-of-day max
      this.checkInterval = Math.min(this.checkInterval * 2, this._getMaxInterval());
      const nextSec = Math.round(this.checkInterval / 1000);
      const ts = this.lastCheck.toLocaleTimeString();

      if (this.consecutiveFailures <= 2) {
        console.log(C.yellow(`  [health] ${tag} ✗ Bale unreachable (${ts}) — retry in ${nextSec}s`));
      } else {
        console.log(C.dim(`  [health] ${tag} ✗ fail #${this.consecutiveFailures} (down ${downSec}s) — retry in ${nextSec}s`));
      }

      // Only declare unhealthy after 60+ seconds of continuous failure
      if (downDuration >= 60000 && wasHealthy) {
        console.log(C.red(`  [health] ✗✗✗ Bale DOWN for ${downSec}s — killing session`));
        this.healthy = false;
        if (this.onHealthChange) this.onHealthChange(false);
      }
    }
  }
}

const healthChecker = new BaleHealthChecker();

let bridgeProc = null;
let tunnelProc = null;
let stopping = false;
let sessionActive = false; // true when bridge+tunnel are running

function killSession() {
  if (tunnelProc) { try { tunnelProc.kill(); } catch {} tunnelProc = null; }
  if (bridgeProc) { try { bridgeProc.kill(); } catch {} bridgeProc = null; }
  // Kill orphan Chrome spawned by bridge (Playwright doesn't always clean up on crash)
  try { execSync('pkill -f "chrome.*profile-b" 2>/dev/null || true'); } catch {}
  try { execSync('pkill -f "Google Chrome.*profile-b" 2>/dev/null || true'); } catch {}
  sessionActive = false;
}

function cleanup() {
  stopping = true;
  healthChecker.stop();
  killSession();
}
process.on('SIGINT', () => { console.log('\n' + C.cyan('Shutting down...')); cleanup(); setTimeout(() => process.exit(0), 1000); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer.trim().toLowerCase()); });
  });
}

async function runSession() {
  console.log(C.cyan('Opening Bale and monitoring for calls...'));
  console.log('');

  return new Promise((resolve) => {
    // Start bridge
    const bridgeArgs = ['bridge.js', '--role', 'callee', '--ws-port', '9001', '--profile', profileDir];
    if (autoAnswer) bridgeArgs.push('--auto-answer');

    bridgeProc = spawn('node', bridgeArgs, {
      cwd: path.join(projectDir, 'bale-integration'),
      stdio: ['pipe', 'pipe', 'pipe'], // stdin/stdout/stderr as pipes
    });

    let callDetected = false;
    let callActive = false;
    let answerSent = false;

    function handleBridgeLine(line) {
      // Always print bridge output with prefix
      if (line.includes('[DC-') || line.includes('[dump')) return; // suppress noisy DC logs
      if (line.includes('[bridge]') || line.includes('[DC]')) {
        console.log(C.dim('  ' + line));
      }

      // Detect incoming call
      if (line.includes('INCOMING_CALL_DETECTED') && !callDetected) {
        callDetected = true;
        console.log('');
        console.log(C.bold(C.yellow('  ╔══════════════════════════════════╗')));
        console.log(C.bold(C.yellow('  ║   INCOMING CALL DETECTED!        ║')));
        console.log(C.bold(C.yellow('  ╚══════════════════════════════════╝')));
        console.log('');

        if (autoAnswer) {
          console.log(C.green('  Auto-answering...'));
        } else {
          // Ask user
          (async () => {
            const answer = await prompt(C.bold('  Answer this call? [Y/n] '));
            if (answer === 'n' || answer === 'no') {
              console.log(C.yellow('  Declining call.'));
              bridgeProc.stdin.write('DECLINE\n');
            } else {
              console.log(C.green('  Answering call!'));
              bridgeProc.stdin.write('ANSWER_NOW\n');
              answerSent = true;
            }
          })();
        }
      }

      // Detect answer failure
      if (line.includes('ANSWER_FAILED') || line.includes('CONFIRM_FAILED')) {
        console.log('');
        console.log(C.bold(C.red('  ⚠  Auto-click failed!')));
        console.log(C.yellow('  Please answer/confirm the call manually in the browser window.'));
        console.log('');
      }

      // Detect call connected
      if (line.includes('CALL ACTIVE') && !callActive) {
        callActive = true;
        console.log('');
        console.log(C.bold(C.green('  ╔══════════════════════════════════╗')));
        console.log(C.bold(C.green('  ║   CALL CONNECTED!                ║')));
        console.log(C.bold(C.green('  ╚══════════════════════════════════╝')));
        console.log('');
        console.log(C.green('  Tunnel active. Caller now has:'));
        console.log(C.green('    SOCKS5 proxy: 127.0.0.1:1080'));
        console.log(C.green('    HTTP proxy:   127.0.0.1:8080'));
        console.log('');
      }

      // Detect call ended
      if (line.includes('Call ended')) {
        console.log('');
        console.log(C.yellow('  Call ended.'));
      }

      // Waiting for approval
      if (line.includes('WAITING_FOR_APPROVAL') && !autoAnswer && !answerSent) {
        // The bridge is waiting — prompt was already shown above
      }
    }

    // Read bridge stdout line by line
    let buffer = '';
    bridgeProc.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line
      for (const line of lines) {
        if (line.trim()) handleBridgeLine(line.trim());
      }
    });
    bridgeProc.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim() && !line.includes('ExperimentalWarning')) {
          console.log(C.dim('  [err] ' + line.trim()));
        }
      }
    });

    // Start tunnel server after bridge is up
    setTimeout(() => {
      tunnelProc = spawn(tunnelBin, ['bale-server', '--bridge', 'ws://localhost:9001'], {
        cwd: projectDir,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      tunnelProc.stdout.on('data', (data) => {
        for (const line of data.toString().split('\n')) {
          if (line.trim() && (line.includes('dc-') || line.includes('[transport]'))) {
            // Suppress verbose transport logs
          } else if (line.trim()) {
            console.log(C.dim('  [tunnel] ' + line.trim()));
          }
        }
      });
      tunnelProc.stderr.on('data', (data) => {
        for (const line of data.toString().split('\n')) {
          if (line.trim()) console.log(C.dim('  [tunnel] ' + line.trim()));
        }
      });
      console.log(C.green('  Server ready.') + ' Waiting for incoming Bale video call...');
      console.log('');
    }, 3000);

    // Wait for bridge to exit
    bridgeProc.on('exit', (code) => {
      bridgeProc = null;
      if (tunnelProc) { try { tunnelProc.kill(); } catch {} tunnelProc = null; }
      resolve(code);
    });
  });
}

// Main loop with health checking
(async () => {
  // Wire up health change callback
  healthChecker.onHealthChange = (healthy) => {
    if (!healthy && sessionActive) {
      console.log(C.red('  [health] Killing session — Bale is down'));
      killSession();
    }
  };

  // Initial health check
  console.log(C.dim('  Checking Bale availability...'));
  await healthChecker.start();

  while (!stopping) {
    // Wait for Bale to be healthy before starting a session
    if (!healthChecker.healthy) {
      console.log(C.yellow('  Waiting for Bale to come back online...'));
      while (!healthChecker.healthy && !stopping) {
        await new Promise(r => setTimeout(r, 5000));
      }
      if (stopping) break;
      console.log(C.green('  Bale is back! Starting session...'));
      await new Promise(r => setTimeout(r, 2000)); // brief pause
    }

    sessionActive = true;
    await runSession();
    sessionActive = false;

    if (!stopping) {
      console.log('');
      console.log(C.yellow('  Restarting in 5 seconds... (Ctrl+C to stop)'));
      await new Promise(r => setTimeout(r, 5000));
    }
  }
})();
