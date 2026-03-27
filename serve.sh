#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "==========================================="
echo "  QR Tunnel Server (Exit Node)"
echo "  Auto-answers Bale calls and provides"
echo "  internet access to the caller."
echo "==========================================="
echo ""

# Build if needed
if [ ! -f qr-tunnel ] || [ cmd/qr-tunnel/main.go -nt qr-tunnel ]; then
  echo "Building qr-tunnel..."
  CGO_ENABLED=0 go build -o qr-tunnel ./cmd/qr-tunnel
fi

# Profile B is YOUR (Amin's) Bale account — the callee
PROFILE="$(pwd)/bale-analysis/profile-b"
if [ ! -d "$PROFILE/Default" ]; then
  echo "ERROR: Bale profile not found at $PROFILE"
  echo "Run the browser once to log in: node bale-integration/bridge.js --role callee --ws-port 9001 --profile $PROFILE"
  exit 1
fi

# Create fake camera if needed
FAKE_CAM="/tmp/qr-fake-camera.y4m"
if [ ! -f "$FAKE_CAM" ]; then
  echo "Creating fake camera file..."
  ffmpeg -y -f lavfi -i "color=c=gray:s=720x720:r=30" -t 120 -pix_fmt yuv420p "$FAKE_CAM" 2>/dev/null
fi

# Install node deps if needed
if [ ! -d bale-integration/node_modules ]; then
  echo "Installing Node.js dependencies..."
  cd bale-integration && npm install && cd ..
fi

echo ""
echo "Starting browser bridge (callee — auto-answers calls)..."
cd bale-integration
node bridge.js --role callee --ws-port 9001 --profile "$PROFILE" &
BRIDGE_PID=$!
cd ..
sleep 3

echo "Starting tunnel server (exit node)..."
./qr-tunnel bale-server --bridge ws://localhost:9001 &
GO_PID=$!
sleep 2

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $GO_PID 2>/dev/null || true
  kill $BRIDGE_PID 2>/dev/null || true
  wait 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

echo ""
echo "==========================================="
echo "  SERVER READY"
echo ""
echo "  Waiting for incoming Bale video call."
echo "  The call will be auto-answered."
echo ""
echo "  Once connected, the caller gets:"
echo "    SOCKS5 proxy at 127.0.0.1:1080"
echo "    HTTP proxy at 127.0.0.1:8080"
echo ""
echo "  Press Ctrl+C to stop."
echo "==========================================="
echo ""

wait
