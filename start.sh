#!/usr/bin/env bash
set -euo pipefail

# Quick start script for qr-tunnel development
# Usage: ./start.sh [client|server|both]

MODE="${1:-both}"
SIGNALING_PORT=3000
SOCKS_PORT=1080
GUI_PORT=8080

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}qr-tunnel — quick start${NC}"
echo ""

# Build
echo -e "${YELLOW}Building...${NC}"
go build -o qr-tunnel ./cmd/qr-tunnel
echo -e "${GREEN}Build OK${NC}"

# Start signaling server
echo -e "${YELLOW}Starting signaling server on :${SIGNALING_PORT}...${NC}"
cd test-tool && node server.js &
SIGNALING_PID=$!
cd ..
sleep 1

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $SIGNALING_PID 2>/dev/null || true
    [ -n "${SERVER_PID:-}" ] && kill $SERVER_PID 2>/dev/null || true
    [ -n "${CLIENT_PID:-}" ] && kill $CLIENT_PID 2>/dev/null || true
    wait 2>/dev/null
    echo -e "${GREEN}Done.${NC}"
}
trap cleanup EXIT

case "$MODE" in
    server)
        echo -e "${GREEN}Starting server mode (callee)...${NC}"
        ./qr-tunnel server --signaling ws://localhost:$SIGNALING_PORT --role callee --gui :$GUI_PORT
        ;;
    client)
        echo -e "${GREEN}Starting client mode (caller)...${NC}"
        ./qr-tunnel client --signaling ws://localhost:$SIGNALING_PORT --role caller --socks5 :$SOCKS_PORT --gui :$GUI_PORT
        ;;
    both)
        echo -e "${GREEN}Starting server (callee) in background...${NC}"
        ./qr-tunnel server --signaling ws://localhost:$SIGNALING_PORT --role callee &
        SERVER_PID=$!
        sleep 2

        echo -e "${GREEN}Starting client (caller) with TUI...${NC}"
        echo -e "${BLUE}SOCKS5 proxy: localhost:${SOCKS_PORT}${NC}"
        echo -e "${BLUE}Web UI: http://localhost:${GUI_PORT}${NC}"
        echo ""
        ./qr-tunnel client --signaling ws://localhost:$SIGNALING_PORT --role caller --socks5 :$SOCKS_PORT --gui :$GUI_PORT
        ;;
    connect)
        echo -e "${GREEN}Starting connect mode (debug)...${NC}"
        ./qr-tunnel connect --signaling ws://localhost:$SIGNALING_PORT --role callee --test-frames
        ;;
    *)
        echo "Usage: $0 [client|server|both|connect]"
        exit 1
        ;;
esac
