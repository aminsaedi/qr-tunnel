#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

TARGET_USER="${1:-884923192}"

echo "=== qr-tunnel Bale Client (Restricted Network) ==="
echo "Target user: $TARGET_USER"
echo ""

# Build Go binary
echo "Building qr-tunnel..."
cd .. && go build -o qr-tunnel ./cmd/qr-tunnel && cd bale-integration

# Start browser bridge (caller — initiates call to target)
echo "Starting browser bridge (caller → user $TARGET_USER, ws://localhost:9000)..."
node bridge.js --role caller --target "$TARGET_USER" --ws-port 9000 &
BRIDGE_PID=$!
sleep 3

# Start Go tunnel client with SOCKS proxy
echo "Starting tunnel client..."
../qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1080 &
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
echo " SOCKS5 proxy: localhost:1080"
echo ""
echo " Test: curl --socks5 localhost:1080 https://httpbin.org/ip"
echo "=================================================="
echo ""

wait
