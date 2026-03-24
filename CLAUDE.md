# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**qr-tunnel** — a Go binary that tunnels TCP traffic through video calls by encoding data as animated QR codes. It uses LT fountain codes for loss resilience and exposes a SOCKS5 proxy for apps to connect through.

Module: `github.com/AminKhosroAli/qr-tunnel`

## Build & Test Commands

```bash
make build              # Build binary for current platform
make build-all          # Cross-compile: macOS/Linux/Windows × amd64/arm64
make test               # Go unit tests with -race (go test ./internal/... -v -race -timeout 120s)
make test-e2e           # Playwright E2E tests (needs Chromium)
make lint               # golangci-lint or go vet fallback

# Run a single Go test:
go test ./internal/qr/ -v -run TestLTCodesRoundTrip -timeout 60s

# Run a single Playwright test:
cd tests && npx playwright test e2e-call.spec.js

# Quick dev start (starts signaling + server + client):
./start.sh both
```

## Critical Constraint: Pure Go, No CGo

Every dependency must be pure Go. The binary must build with `CGO_ENABLED=0`. No C toolchain, no libvpx, no OpenCV. This is why video frames are sent as JPEG over WebRTC DataChannels instead of VP8 media tracks (no pure-Go VP8 encoder exists).

Verify with: `CGO_ENABLED=0 go build ./cmd/qr-tunnel`

## Architecture

```
App → SOCKS5 (:1080) → Transport (mux + reliable) → QR Encoder → WebRTC DataChannel
                                                                        ↕ (signaling server)
Remote TCP ← Transport ← QR Decoder ← WebRTC DataChannel
```

**Data path:** Binary data → LT fountain code blocks → base64 → QR code image frames → JPEG over DataChannel → decode QR → LT reassemble → binary data.

### Key Abstraction: `CallProvider` interface (`internal/provider/provider.go`)

```go
type CallProvider interface {
    Connect(signalingURL string, opts CallOptions) error
    SendFrame(frame *Frame) error
    OnFrame(cb func(*Frame))
    OnState(cb func(State))
    Close() error
}
```

All code outside `internal/provider/` talks to this interface — never to pion/webrtc directly. The current implementation uses pion DataChannels with JPEG-encoded frames. Future messenger integrations (Bale, etc.) implement this same interface.

### Layer Stack

| Layer | Package | Role |
|---|---|---|
| CLI | `cmd/qr-tunnel/` | Subcommands: `client`, `server`, `connect` |
| SOCKS5 | `internal/socks5/` | Accepts CONNECT, maps to transport streams |
| Transport | `internal/transport/` | Reliable multiplexed streams (SYN/ACK/FIN, sliding window, retransmit) |
| QR Codec | `internal/qr/` | LT fountain codes + QR encode/decode with gozxing |
| Provider | `internal/provider/webrtc/` | pion/webrtc DataChannel, signaling via WebSocket |
| TUI | `internal/tui/` | bubbletea real-time dashboard |
| Web UI | `internal/webui/` | Embedded HTTP dashboard + SimLab API (`//go:embed`) |

### Signaling Race Condition (already fixed, but know this)

The `OnMessage` handler must be registered BEFORE `signaling.Connect()` because the `welcome` message arrives almost instantly on localhost. The PeerConnection and DataChannel are also created before connecting to signaling.

## QR Payload Format

Binary payload is base64-encoded before embedding in QR. Header (20 bytes):
`[1B magic=0xAA][1B ver][4B session_id][4B seq][2B total_blocks][2B lt_index][4B lt_seed][2B payload_len]`

## E2E Test Ports

Tests use ports 4001–4007 (not 3000) to avoid conflicts with development. Tests run serially (1 worker) because each test spawns its own signaling server and Go binary processes. The `helpers.js` manages process lifecycle with detached process groups.

## CLI Modes

- `client` — SOCKS5 proxy + TUI + optional web UI. Connects as caller or callee.
- `server` — Exit node + TUI. Accepts transport streams and dials real TCP destinations.
- `connect` — Minimal debug mode (no TUI, no SOCKS5). Useful for testing WebRTC connectivity. Supports `--test-frames` to send QR patterns and `--gui` for web dashboard.
