#!/bin/bash
# QR Tunnel — Client Bundle Start Script
# Auto-reconnects if the tunnel dies (heartbeat failure, network drop, etc.)
#
# Flags:
#   --target USER_ID      Bale user ID to call (default: 884923192)
#   --login-wait N        Seconds to wait for manual Bale login (default: 60, skipped if already logged in)
#   --force-login-wait    Always show login countdown (don't auto-detect)
#   --retry-wait N        Seconds to wait between reconnect attempts (default: 5)
#   --socks5-port N       SOCKS5 proxy port (default: 1080)
#   --http-port N         HTTP proxy port (default: 8080)
#   --bridge-port N       WebSocket port between bridge and qr-tunnel (default: 9000)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$SCRIPT_DIR/node/bin:$SCRIPT_DIR/bin:$PATH"
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Defaults
TARGET_USER="884923192"
LOGIN_WAIT=60
FORCE_LOGIN_WAIT=false
RETRY_WAIT=5
SOCKS5_PORT=1080
HTTP_PORT=8080
BRIDGE_PORT=9000

# Parse flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET_USER="$2"; shift 2 ;;
    --login-wait) LOGIN_WAIT="$2"; shift 2 ;;
    --force-login-wait) FORCE_LOGIN_WAIT=true; shift ;;
    --retry-wait) RETRY_WAIT="$2"; shift 2 ;;
    --socks5-port) SOCKS5_PORT="$2"; shift 2 ;;
    --http-port) HTTP_PORT="$2"; shift 2 ;;
    --bridge-port) BRIDGE_PORT="$2"; shift 2 ;;
    --help|-h)
      grep '^#' "$0" | grep -v '#!/' | sed 's/^# \?//'
      exit 0
      ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

echo "==========================================="
echo "  QR Tunnel — Caller (Client Side)"
echo "  Target Bale user: $TARGET_USER"
echo "  Login wait:       ${LOGIN_WAIT}s (force=${FORCE_LOGIN_WAIT})"
echo "  Retry wait:       ${RETRY_WAIT}s between reconnects"
echo "  SOCKS5 port:      ${SOCKS5_PORT}"
echo "  HTTP port:        ${HTTP_PORT}"
echo "  Auto-reconnects on disconnect"
echo "==========================================="
echo ""

# Find Chrome
if [ -n "${PLAYWRIGHT_BROWSERS_PATH:-}" ] && [ -x "$SCRIPT_DIR/browsers/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" ]; then
  CHROME="$SCRIPT_DIR/browsers/chromium-1208/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
else
  CHROME=""
  for c in \
    /usr/bin/google-chrome-stable \
    /usr/bin/google-chrome \
    /usr/bin/chromium-browser \
    /usr/bin/chromium \
    /snap/bin/chromium \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
    [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -z "$CHROME" ] && { echo "ERROR: Chrome not found"; exit 1; }
echo "Browser: $CHROME"
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$CHROME"
echo "Node.js: $(node --version)"

# Fake camera
FAKE_CAM="/tmp/qr-fake-camera.y4m"
if [ ! -f "$FAKE_CAM" ]; then
  echo "Creating fake camera file..."
  "$SCRIPT_DIR/bin/ffmpeg" -y -f lavfi -i "testsrc2=size=1280x720:rate=30" -t 120 -pix_fmt yuv420p "$FAKE_CAM" 2>/dev/null
fi

chmod +x "$SCRIPT_DIR/qr-tunnel"

READY_FILE="/tmp/qr-bridge-${BRIDGE_PORT}.ready"
STOPPED=false
trap 'STOPPED=true; echo ""; echo "Stopping..."; kill $TUNNEL_PID 2>/dev/null; kill $BRIDGE_PID 2>/dev/null; wait 2>/dev/null; echo "Bye."; exit 0' INT TERM

ATTEMPT=0
while [ "$STOPPED" = "false" ]; do
  ATTEMPT=$((ATTEMPT + 1))
  echo ""
  echo "=== Session #$ATTEMPT ==="
  echo ""

  # Kill leftovers from previous session
  pkill -f "bridge.js.*caller" 2>/dev/null || true
  lsof -ti:${BRIDGE_PORT} 2>/dev/null | xargs kill -9 2>/dev/null || true
  rm -f "$READY_FILE"
  sleep 1

  # Build bridge command
  BRIDGE_CMD=(node "$SCRIPT_DIR/scripts/bridge.js"
    --role caller
    --target "$TARGET_USER"
    --ws-port "$BRIDGE_PORT"
    --profile "$SCRIPT_DIR/bale-profile"
    --login-wait "$LOGIN_WAIT")
  [ "$FORCE_LOGIN_WAIT" = "true" ] && BRIDGE_CMD+=(--force-login-wait)

  echo "Starting browser bridge..."
  cd "$SCRIPT_DIR/scripts"
  "${BRIDGE_CMD[@]}" &
  BRIDGE_PID=$!
  cd "$SCRIPT_DIR"

  # Wait for bridge WS to be ready (written ~immediately after bridge starts)
  echo "Waiting for bridge to be ready..."
  MAX_WAIT=30
  waited=0
  while [ ! -f "$READY_FILE" ] && [ $waited -lt $MAX_WAIT ] && [ "$STOPPED" = "false" ]; do
    sleep 1
    waited=$((waited + 1))
  done

  if [ "$STOPPED" = "true" ]; then break; fi

  if [ ! -f "$READY_FILE" ]; then
    echo "[client] Bridge did not start after ${MAX_WAIT}s, retrying..."
    kill $BRIDGE_PID 2>/dev/null || true
    sleep "$RETRY_WAIT"
    continue
  fi
  echo "Bridge ready after ${waited}s."
  sleep 2

  echo "Starting QR tunnel client..."
  "$SCRIPT_DIR/qr-tunnel" bale-client \
    --bridge "ws://localhost:${BRIDGE_PORT}" \
    --socks5 ":${SOCKS5_PORT}" \
    --http ":${HTTP_PORT}" &
  TUNNEL_PID=$!

  echo ""
  echo "==========================================="
  echo "  TUNNEL STARTING!"
  echo ""
  echo "  SOCKS5 proxy:  127.0.0.1:${SOCKS5_PORT}"
  echo "  HTTP proxy:    127.0.0.1:${HTTP_PORT}"
  echo ""
  echo "  Telegram: Settings > Advanced > Proxy"
  echo "    Type: SOCKS5"
  echo "    Server: 127.0.0.1"
  echo "    Port: ${SOCKS5_PORT}"
  echo ""
  echo "  Waiting for Bale call to connect..."
  echo "  Press Ctrl+C to stop."
  echo "==========================================="
  echo ""

  # Wait for either process to exit
  # bridge dies = call ended / nav failed; tunnel dies = heartbeat killed it
  wait -n $BRIDGE_PID $TUNNEL_PID 2>/dev/null || true

  # Clean up this session
  kill $TUNNEL_PID 2>/dev/null || true
  kill $BRIDGE_PID 2>/dev/null || true
  wait $TUNNEL_PID 2>/dev/null || true
  wait $BRIDGE_PID 2>/dev/null || true

  if [ "$STOPPED" = "false" ]; then
    echo ""
    echo "[client] Session ended. Reconnecting in ${RETRY_WAIT}s... (Ctrl+C to stop)"
    sleep "$RETRY_WAIT"
  fi
done
