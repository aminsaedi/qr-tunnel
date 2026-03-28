# QR Tunnel over Bale Video Call -- Setup Guide

This guide explains how to set up a censorship-circumvention tunnel that hides internet traffic inside a Bale messenger video call. One person (the **caller**, inside Iran) initiates a Bale video call to a second person (the **server/callee**, outside Iran with unrestricted internet). Data is encoded as bitmap patterns in the video stream, providing a covert TCP tunnel.

---

## How It Works

```
[Your Apps] --> SOCKS5/HTTP proxy (:1080/:8080)
    --> qr-tunnel (Go binary, encodes data as bitmap frames)
    --> browser bridge (Playwright, injects frames into Bale video call)
    --> Bale video call (looks like a normal call to network observers)
    --> browser bridge on server side (captures frames from video)
    --> qr-tunnel server (decodes frames, dials real destinations)
    --> [Open Internet]
```

The tunnel uses the video track of a real Bale video call. To network monitoring equipment, this looks like an ordinary Bale video call with nothing unusual. The bitmap-encoded data survives Bale's VP9 video compression.

---

## Roles

| Role | Who | What they do |
|------|-----|-------------|
| **Caller** (client) | Friend in Iran | Initiates the Bale video call, runs SOCKS5/HTTP proxy locally |
| **Callee** (server) | Amin (outside Iran) | Auto-answers the call, acts as exit node to the open internet |

Both sides need a Bale account logged into `web.bale.ai` via a Playwright browser profile.

---

## Part 1: Caller Setup (Friend in Iran)

### Prerequisites

- **Operating System**: Linux (amd64 or arm64), macOS, or Windows
- **Node.js**: v18 or newer (v20+ recommended)
- **A Bale account**: You need a phone number registered with Bale

### Step 1: Install Node.js

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (alternative -- nvm):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 20
```

**macOS:**
```bash
brew install node@20
```

**Windows:**
Download from https://nodejs.org/en/download and install the LTS version.

Verify:
```bash
node --version   # Should show v18+
npm --version
```

### Step 2: Create a working directory and install dependencies

```bash
mkdir -p ~/qr-tunnel && cd ~/qr-tunnel

# Create package.json
cat > package.json << 'EOF'
{
  "dependencies": {
    "playwright": "^1.58.2",
    "ws": "^8.20.0"
  }
}
EOF

npm install

# Install Chromium browser for Playwright
npx playwright install chromium
```

This installs:
- **playwright** -- browser automation library (controls Chromium)
- **ws** -- WebSocket library (communication between bridge and Go binary)

### Step 3: Download the qr-tunnel Go binary

Download the pre-built binary for your platform from GitHub Releases:

**Linux amd64:**
```bash
curl -L https://github.com/aminsaedi/qr-tunnel/releases/latest/download/qr-tunnel-linux-amd64.tar.gz | tar xz
chmod +x qr-tunnel
```

**Linux arm64:**
```bash
curl -L https://github.com/aminsaedi/qr-tunnel/releases/latest/download/qr-tunnel-linux-arm64.tar.gz | tar xz
chmod +x qr-tunnel
```

**macOS Apple Silicon:**
```bash
curl -L https://github.com/aminsaedi/qr-tunnel/releases/latest/download/qr-tunnel-macos-arm64.tar.gz | tar xz
chmod +x qr-tunnel
```

**macOS Intel:**
```bash
curl -L https://github.com/aminsaedi/qr-tunnel/releases/latest/download/qr-tunnel-macos-amd64.tar.gz | tar xz
chmod +x qr-tunnel
```

**Windows amd64:**
Download `qr-tunnel-windows-amd64.zip` from the releases page and extract `qr-tunnel.exe`.

Verify:
```bash
./qr-tunnel version
```

### Step 4: Download the browser bridge script

Save the bridge script. Ask Amin for the latest `bridge.js` file, or copy it from the repository's `bale-integration/bridge.js`. Place it in your `~/qr-tunnel/` directory.

### Step 5: Create a fake camera file

The bridge needs a dummy video file so Chrome thinks a camera is present. Create one with ffmpeg:

```bash
ffmpeg -f lavfi -i testsrc=size=720x720:rate=30 -t 10 -pix_fmt yuv420p /tmp/qr-fake-camera.y4m
```

If you do not have ffmpeg, install it:
- **Linux:** `sudo apt install ffmpeg`
- **macOS:** `brew install ffmpeg`
- **Windows:** Download from https://ffmpeg.org/download.html

The file must be at `/tmp/qr-fake-camera.y4m` (or `C:\tmp\qr-fake-camera.y4m` on Windows -- you may need to adjust the path in bridge.js).

### Step 6: Log in to Bale and create a browser profile

This is a one-time setup. Playwright uses a persistent browser profile to remember your Bale login session.

```bash
# Create profile directory
mkdir -p ~/qr-tunnel/profile-caller

# Open Bale in a Playwright browser to log in manually
node -e "
const { chromium } = require('playwright');
(async () => {
  const ctx = await chromium.launchPersistentContext('./profile-caller', {
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
    viewport: { width: 1280, height: 800 },
  });
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto('https://web.bale.ai/');
  console.log('Log in to Bale in the browser window.');
  console.log('After logging in, close the browser window to save the session.');
  await new Promise(() => {});  // Keep open until you close it
})();
"
```

**What to do:**
1. A Chromium window opens showing Bale's login page
2. Enter your phone number, receive the SMS code, and log in
3. Make sure you can see your chat list (the main Bale screen)
4. Close the browser window (Ctrl+W or click X)

The session is now saved in `~/qr-tunnel/profile-caller/`. The `access_token` cookie set by Bale has a **1-year expiry**, so you should not need to log in again for about a year.

### Step 7: Get the server's Bale user ID

Ask Amin for his Bale **user ID** (a numeric ID like `884923192`). This is the account the caller will dial. You can find a user's ID by opening their profile in Bale web and checking the URL.

### Step 8: Start the tunnel

**Terminal 1 -- Start the browser bridge:**
```bash
cd ~/qr-tunnel
node bridge.js --role caller --target <AMIN_BALE_USER_ID> --ws-port 9000 --profile ./profile-caller
```

Replace `<AMIN_BALE_USER_ID>` with the numeric user ID Amin gives you.

This will:
- Open Chromium with your Bale session
- Navigate to the chat with the target user
- Click the video call button
- Wait for the call to connect

**Terminal 2 -- Start the Go tunnel client:**
```bash
cd ~/qr-tunnel
./qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1080 --http :8080
```

Wait until you see:
```
=== PROXY READY ===
  SOCKS5: localhost:1080
  HTTP:   localhost:8080 (for Telegram)
```

### Step 9: Configure your applications

**Test with curl:**
```bash
curl --socks5 localhost:1080 https://httpbin.org/ip
```
You should see the server's (Amin's) IP address, not your own.

**Telegram Desktop:**
1. Open Settings > Advanced > Connection type > Use custom proxy
2. Select "HTTP" proxy
3. Server: `127.0.0.1`, Port: `8080`
4. Leave username/password empty
5. Save

**Firefox browser:**
1. Settings > Network Settings > Manual proxy configuration
2. SOCKS Host: `127.0.0.1`, Port: `1080`, SOCKS v5
3. Check "Proxy DNS when using SOCKS v5"

**System-wide (Linux):**
```bash
export http_proxy=socks5://127.0.0.1:1080
export https_proxy=socks5://127.0.0.1:1080
```

### One-liner startup script

Create `~/qr-tunnel/start.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

TARGET_USER="${1:?Usage: ./start.sh <bale_user_id>}"

echo "Starting browser bridge (caller -> user $TARGET_USER)..."
node bridge.js --role caller --target "$TARGET_USER" --ws-port 9000 --profile ./profile-caller &
BRIDGE_PID=$!
sleep 5

echo "Starting tunnel client..."
./qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1080 --http :8080 &
GO_PID=$!

cleanup() {
    echo "Shutting down..."
    kill $GO_PID 2>/dev/null || true
    kill $BRIDGE_PID 2>/dev/null || true
    wait 2>/dev/null
}
trap cleanup EXIT

echo ""
echo "========================================"
echo " SOCKS5 proxy: localhost:1080"
echo " HTTP proxy:   localhost:8080 (Telegram)"
echo " Test: curl --socks5 localhost:1080 https://httpbin.org/ip"
echo "========================================"

wait
```

Then: `chmod +x start.sh && ./start.sh <AMIN_BALE_USER_ID>`

---

## Part 2: Server Setup (Amin's Side)

The server (callee) runs outside Iran with unrestricted internet access. It auto-answers incoming Bale video calls and acts as the exit node.

### Prerequisites

Same as the caller: Node.js, Playwright, the Go binary, and a logged-in Bale browser profile.

### Setup

```bash
cd ~/qr-tunnel   # or wherever your setup lives

# The browser profile for the callee should already be logged in.
# If not, follow Step 6 above but use ./profile-server as the directory.
```

### Start the server

**Terminal 1 -- Browser bridge (callee, auto-answer):**
```bash
node bridge.js --role callee --ws-port 9001 --profile ./profile-server
```

This will:
- Open Chromium with the Bale session
- Wait on the Bale home screen for an incoming call
- Automatically answer when a call arrives

**Terminal 2 -- Go tunnel server (exit node):**
```bash
./qr-tunnel bale-server --bridge ws://localhost:9001
```

The server is now waiting. When the caller initiates a video call, it will auto-answer and start relaying traffic.

### Server startup script

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "Starting browser bridge (callee, auto-answer)..."
node bridge.js --role callee --ws-port 9001 --profile ./profile-server &
BRIDGE_PID=$!
sleep 5

echo "Starting tunnel server (exit node)..."
./qr-tunnel bale-server --bridge ws://localhost:9001 &
GO_PID=$!

cleanup() {
    kill $GO_PID 2>/dev/null || true
    kill $BRIDGE_PID 2>/dev/null || true
    wait 2>/dev/null
}
trap cleanup EXIT

echo "Server ready. Waiting for incoming call."
wait
```

---

## Bandwidth Expectations

This is a low-bandwidth tunnel. Data is encoded as bitmap patterns in 720x720 video frames, compressed through Bale's VP9 video codec. Expect:

- **Throughput**: approximately 1--5 KB/s usable (varies with video quality)
- **Latency**: 500ms--2s round trip
- **Suitable for**: Telegram messaging, low-bandwidth web browsing, API calls
- **Not suitable for**: video streaming, large downloads, real-time gaming

---

## Token / Session Validity

The Bale web app stores authentication as an `access_token` cookie on `.bale.ai`. Key details:

- **Cookie lifetime**: ~360 days (1 year) from the time of login
- **Storage**: encrypted in the Chromium profile's `Default/Cookies` SQLite database
- **Renewal**: logging in again resets the 1-year timer
- **No JWT**: the token value is opaque (not a JWT), stored encrypted by Chromium

As long as you do not clear browser data or explicitly log out, the profile remains valid for about a year. If the session expires, simply repeat Step 6 to log in again.

---

## Troubleshooting

### "Bridge: Go connected" but no "CALL ACTIVE"

- Make sure both sides are running (caller and callee)
- The caller must have the correct target user ID
- Check that Bale is not blocked on your network (try opening web.bale.ai in a regular browser)
- The callee must be on the Bale home screen (not in a different chat) so the incoming call notification is visible

### "socks5 start failed: listen tcp :1080: bind: address already in use"

Another process is using port 1080. Either kill it or use a different port:
```bash
./qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1081 --http :8081
```

### Browser opens but Bale shows login screen

Your session has expired. Close everything and repeat Step 6 to log in again.

### "bridge connect failed: dial tcp 127.0.0.1:9000: connection refused"

The browser bridge is not running yet. Start the bridge (Terminal 1) before starting the Go binary (Terminal 2). Wait at least 3--5 seconds after the bridge starts.

### No video frames being exchanged

- Check that `/tmp/qr-fake-camera.y4m` exists. If not, re-create it (Step 5).
- The bridge log should show `[bridge] rx<-video #1 (720x720)` when frames arrive.
- If you see `[bridge] capture: waiting` repeatedly, the call video has not started yet.

### Very slow or no data through the proxy

- Bale may be throttling video quality. The tunnel automatically adapts but extreme throttling can reduce throughput to near zero.
- Try closing other tabs/apps that use bandwidth.
- The tunnel works best when the Bale call shows clear video (check the small green-bordered preview canvas in the bottom-right corner of the browser).

### Playwright cannot find Chromium

If `npx playwright install chromium` fails behind a firewall, you may need to download Chromium manually. Check the Playwright docs for offline installation: https://playwright.dev/docs/browsers#install-browsers

### Windows-specific notes

- Use PowerShell or Git Bash for shell commands
- The fake camera path needs to be adjusted: edit `bridge.js` and change the `FAKE_CAMERA` constant to a valid Windows path like `C:\\tmp\\qr-fake-camera.y4m`
- Create `C:\tmp\` directory if it does not exist

---

## File Checklist

After setup, your `~/qr-tunnel/` directory should contain:

```
~/qr-tunnel/
  bridge.js              # Browser bridge script (from Amin)
  qr-tunnel              # Go binary (from GitHub releases)
  package.json           # Node.js dependencies
  node_modules/          # Installed by npm install
  profile-caller/        # Chromium profile with Bale login
    Default/
      Cookies            # Contains the access_token (1-year validity)
      Local Storage/     # Bale app state
      ...
  start.sh               # Optional convenience script
```

---

## Security Notes

- The browser profile directory (`profile-caller/`) contains your Bale session. Treat it like a password -- do not share it.
- Traffic between your apps and the local proxy is unencrypted (localhost only). Do not bind the SOCKS5/HTTP proxy to `0.0.0.0` unless you know what you are doing.
- The tunnel provides concealment (traffic looks like a video call), not additional encryption beyond what your apps already use (HTTPS/TLS).
- Bale itself can see that a video call is happening between two accounts, but cannot see the encoded data in the video frames (it looks like visual noise/patterns).
