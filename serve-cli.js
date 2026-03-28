#!/usr/bin/env node
// QR Tunnel Server CLI — monitors Bale for incoming calls with interactive control
const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const autoAnswer = process.argv.includes('--auto-answer') || process.argv.includes('-a');
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
    execSync(`ffmpeg -y -f lavfi -i "color=c=gray:s=720x720:r=30" -t 120 -pix_fmt yuv420p ${fakeCam} 2>/dev/null`);
  } catch {}
}

let bridgeProc = null;
let tunnelProc = null;
let stopping = false;

function cleanup() {
  stopping = true;
  if (tunnelProc) { try { tunnelProc.kill(); } catch {} }
  if (bridgeProc) { try { bridgeProc.kill(); } catch {} }
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

// Main loop
(async () => {
  while (!stopping) {
    await runSession();
    if (!stopping) {
      console.log('');
      console.log(C.yellow('  Restarting in 5 seconds... (Ctrl+C to stop)'));
      await new Promise(r => setTimeout(r, 5000));
    }
  }
})();
