# qr-tunnel

TCP tunnel over video calls using animated QR codes.

A single Go binary that encodes outbound TCP data as QR code frames, sends them over a WebRTC video call, and decodes them on the other side. Apps connect via a local SOCKS5 proxy. LT fountain codes provide resilience against frame loss.

```
┌──────────────────────────────────────────────────────────┐
│                     qr-tunnel binary                     │
│                                                          │
│  App ──► SOCKS5 ──► Transport ──► QR Encoder ──► WebRTC  │
│               (:1080)    (mux+reliable)    (LT codes)    │
│                                                          │
│  Remote TCP ◄── Transport ◄── QR Decoder ◄── WebRTC     │
│                                                          │
│  ┌─────────┐  ┌───────────────────┐                      │
│  │   TUI   │  │ Web UI (optional) │                      │
│  └─────────┘  └───────────────────┘                      │
└──────────────────────────────────────────────────────────┘
```

## Features

- **Pure Go** — no CGo, no C toolchain. Cross-compiles from anywhere.
- **LT fountain codes** — reconstructs data from any sufficient subset of frames. Handles 30%+ frame loss.
- **SOCKS5 proxy** — any app that speaks SOCKS5 can tunnel through a video call.
- **Multiplexed streams** — multiple TCP connections share one QR channel with independent flow control.
- **TUI dashboard** — real-time metrics: throughput, QR decode rate, RTT, active streams. Interactive parameter tuning.
- **Web UI + SimLab** — optional browser dashboard with network simulation sliders (frame drop, noise, delay).
- **Pluggable providers** — `CallProvider` interface abstracts WebRTC. Swap in any video call backend.

## Quick Start

```bash
# Clone and build
git clone https://github.com/AminKhosroAli/qr-tunnel.git
cd qr-tunnel
make build

# Install test-tool dependencies (signaling server)
cd test-tool && npm install && cd ..

# Run both server and client (starts signaling automatically)
./start.sh both
```

The client SOCKS5 proxy listens on `localhost:1080`. Test it:

```bash
curl --socks5 localhost:1080 https://httpbin.org/ip
```

## Usage

```
qr-tunnel client  [flags]    Client mode (SOCKS5 proxy + TUI)
qr-tunnel server  [flags]    Server mode (exit node + TUI)
qr-tunnel connect [flags]    Debug mode (no TUI, logs to stdout)
qr-tunnel version            Show version
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--signaling` | `ws://localhost:3000` | Signaling server WebSocket URL |
| `--role` | `callee` | `caller` or `callee` |
| `--socks5` | `:1080` | SOCKS5 listen address (client only) |
| `--gui` | *(disabled)* | Web UI listen address (e.g., `:8080`) |
| `--fps` | `15` | QR frames per second |
| `--qr-version` | `25` | QR version 1–40 (higher = more data per frame) |
| `--ecc` | `M` | Error correction: `L`, `M`, `Q`, `H` |
| `--chunk-size` | `800` | Bytes per LT block |

### Examples

```bash
# Server as callee with web dashboard
qr-tunnel server --signaling ws://signal.example.com --role callee --gui :8080

# Client as caller with SOCKS5 on custom port
qr-tunnel client --signaling ws://signal.example.com --role caller --socks5 :9050

# Debug: connect and send test QR frames
qr-tunnel connect --signaling ws://localhost:3000 --role callee --test-frames --gui :8080
```

## Architecture

### Layer Stack

| Layer | Package | Purpose |
|-------|---------|---------|
| CLI | `cmd/qr-tunnel/` | Subcommands, flag parsing, wiring |
| SOCKS5 | `internal/socks5/` | SOCKS5 CONNECT, maps connections to transport streams |
| Transport | `internal/transport/` | Reliable multiplexed streams (SYN/ACK/FIN, sliding window, retransmit) |
| QR Codec | `internal/qr/` | LT fountain codes + QR encode/decode |
| Provider | `internal/provider/` | `CallProvider` interface + pion/webrtc implementation |
| TUI | `internal/tui/` | bubbletea real-time dashboard |
| Web UI | `internal/webui/` | Embedded HTTP dashboard + SimLab controls |

### CallProvider Interface

```go
type CallProvider interface {
    Connect(signalingURL string, opts CallOptions) error
    SendFrame(frame *Frame) error      // Send an RGBA image frame
    OnFrame(cb func(*Frame))           // Receive RGBA image frames
    OnState(cb func(State))            // Connection state changes
    Close() error
}
```

No code outside `internal/provider/` imports pion/webrtc. Future video call backends (Bale, etc.) implement this interface.

### Data Flow

```
TCP data
  → split into chunks
  → LT fountain encode (robust soliton distribution)
  → serialize with 20-byte header (magic, session, seq, LT params)
  → base64 encode
  → render as QR code image (720x720)
  → JPEG compress
  → send over WebRTC DataChannel
  → receive and JPEG decode
  → scan QR code (gozxing with Otsu binarization)
  → base64 decode
  → parse header, feed LT block to decoder
  → when k+ blocks received: reconstruct original data
  → deliver to transport stream
```

## Building

```bash
make build          # Build for current platform
make build-all      # Cross-compile all 5 targets
make clean          # Remove build artifacts
```

Cross-compilation targets:
- `darwin/amd64`, `darwin/arm64`
- `linux/amd64`, `linux/arm64`
- `windows/amd64`

All builds use `CGO_ENABLED=0` — no C compiler needed.

## Testing

### Unit Tests

```bash
make test                                                    # All tests with -race
go test ./internal/qr/ -v -run TestLTCodesRoundTrip          # Single test
go test ./internal/qr/ -v -run TestEncoderDecoderWithFrameLoss  # QR round-trip with 30% loss
```

### E2E Tests (Playwright)

```bash
cd tests && npm install
npx playwright install chromium    # First time only
npx playwright test                # Run all 13 E2E tests
npx playwright test e2e-call.spec.js   # Single suite
```

E2E tests cover:
- **Call establishment** — Go binary ↔ browser WebRTC, signaling relay
- **QR frame exchange** — Go→browser and browser→Go frame transfer at 14fps
- **Tunnel connectivity** — Two Go binaries connect, Web UI serves dashboard + SimLab API
- **Degradation** — QR codec with frame loss, LT codes stress test, cross-compilation verification

### Test Tool (Signaling Server)

```bash
cd test-tool && npm install
node server.js                     # Runs on :3000
PORT=4000 node server.js           # Custom port
```

Minimal WebSocket relay for exactly 2 peers. Used by both E2E tests and development.

## Web UI

Start with `--gui :8080`:

- **Dashboard** (`/`) — live metrics: throughput, QR FPS, decode rate, RTT, active streams
- **SimLab** (`/simlab`) — network simulation sliders:
  - Frame drop rate (0–80%)
  - Pixel noise (0–50%)
  - Decode delay (0–500ms)
  - QR version, FPS, chunk size

API endpoints:
- `GET /api/metrics` — JSON metrics snapshot
- `GET/POST /api/sim` — read/write simulation parameters

## TUI Controls

| Key | Action |
|-----|--------|
| `Tab` | Toggle parameter editing mode |
| `↑/↓` | Select parameter |
| `←/→` | Adjust value |
| `q` | Quit |

Parameters adjustable at runtime: QR version, ECC level, FPS, chunk size, simulated drop/noise/delay.

## License

MIT
