#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "=== qr-tunnel Bale Server (Exit Node) ==="
echo ""

# Build Go binary
echo "Building qr-tunnel..."
cd .. && go build -o qr-tunnel ./cmd/qr-tunnel && cd bale-integration

# Start browser bridge (callee — auto-answers calls)
echo "Starting browser bridge (callee, ws://localhost:9001)..."
node bridge.js --role callee --ws-port 9001 &
BRIDGE_PID=$!
sleep 3

# Start Go tunnel server
echo "Starting tunnel server..."
../qr-tunnel bale-server --bridge ws://localhost:9001 &
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
echo "============================================"
echo " Server running. Waiting for incoming call."
echo " The call will be auto-answered."
echo "============================================"
echo ""

wait
