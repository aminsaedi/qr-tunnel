#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

TARGET_USER="${1:-884923192}"
LOGIN_WAIT="${LOGIN_WAIT:-60}"
RETRY_WAIT="${RETRY_WAIT:-5}"
BRIDGE_PORT="${BRIDGE_PORT:-9000}"
SOCKS5_ADDR="${SOCKS5_ADDR:-:1080}"
HTTP_ADDR="${HTTP_ADDR:-:8080}"
FORCE_LOGIN_WAIT=false

# Parse extra flags
shift 1 2>/dev/null || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --login-wait) LOGIN_WAIT="$2"; shift 2 ;;
    --force-login-wait) FORCE_LOGIN_WAIT=true; shift ;;
    --retry-wait) RETRY_WAIT="$2"; shift 2 ;;
    --socks5) SOCKS5_ADDR="$2"; shift 2 ;;
    --http) HTTP_ADDR="$2"; shift 2 ;;
    --bridge-port) BRIDGE_PORT="$2"; shift 2 ;;
    *) shift ;;
  esac
done

echo "=== qr-tunnel Bale Client (Restricted Network) ==="
echo "Target user:   $TARGET_USER"
echo "Login wait:    ${LOGIN_WAIT}s (force=${FORCE_LOGIN_WAIT})"
echo "SOCKS5 proxy:  $SOCKS5_ADDR"
echo "HTTP proxy:    $HTTP_ADDR"
echo ""

# Build Go binary
echo "Building qr-tunnel..."
cd .. && CGO_ENABLED=0 go build -o qr-tunnel ./cmd/qr-tunnel && cd bale-integration

READY_FILE="/tmp/qr-bridge-${BRIDGE_PORT}.ready"
rm -f "$READY_FILE"

# Build bridge flags
BRIDGE_ARGS=(bridge.js --role caller --target "$TARGET_USER" --ws-port "$BRIDGE_PORT" --login-wait "$LOGIN_WAIT")
[ "$FORCE_LOGIN_WAIT" = "true" ] && BRIDGE_ARGS+=(--force-login-wait)

# Start browser bridge (caller — initiates call to target)
echo "Starting browser bridge (caller → user $TARGET_USER)..."
node "${BRIDGE_ARGS[@]}" &
BRIDGE_PID=$!

# Wait for bridge WS to be ready (written immediately after WS server starts)
echo "Waiting for bridge WS (ready file: $READY_FILE)..."
MAX_WAIT=30
waited=0
while [ ! -f "$READY_FILE" ] && [ $waited -lt $MAX_WAIT ]; do
  sleep 1
  waited=$((waited + 1))
done
if [ ! -f "$READY_FILE" ]; then
  echo "ERROR: Bridge did not become ready after ${MAX_WAIT}s"
  kill $BRIDGE_PID 2>/dev/null || true
  exit 1
fi
echo "Bridge ready after ${waited}s. Starting tunnel..."
sleep 2

# Start Go tunnel client with SOCKS + HTTP proxy
../qr-tunnel bale-client \
  --bridge "ws://localhost:${BRIDGE_PORT}" \
  --socks5 "$SOCKS5_ADDR" \
  --http "$HTTP_ADDR" &
GO_PID=$!

cleanup() {
    echo ""
    echo "Shutting down..."
    kill $GO_PID 2>/dev/null || true
    kill $BRIDGE_PID 2>/dev/null || true
    wait 2>/dev/null
    echo "Done."
}
trap cleanup EXIT

echo ""
echo "=================================================="
echo " Client running!"
echo " SOCKS5 proxy: localhost${SOCKS5_ADDR}"
echo " HTTP proxy:   localhost${HTTP_ADDR}"
echo ""
echo " Test: curl --socks5 localhost:1080 https://httpbin.org/ip"
echo " Waiting for Bale call to connect..."
echo "=================================================="
echo ""

wait
