# qr-tunnel

TCP tunnel through video calls. Tunnels internet traffic through Bale messenger video calls using LiveKit DataChannels, enabling access to restricted services like Telegram.

```
┌─────────────────────────────────────────────────────────────┐
│  Your App (Telegram, Browser, etc.)                          │
│       ↓                                                      │
│  SOCKS5 Proxy (:1080) / HTTP Proxy (:8080)                  │
│       ↓                                                      │
│  Transport Layer (multiplexed streams, SYN/ACK/FIN)          │
│       ↓                                                      │
│  DataChannel Transport (LiveKit protobuf over WebRTC)        │
│       ↓                                                      │
│  Bale Video Call (via Playwright browser automation)          │
│       ↓  ↑                                                   │
│  LiveKit SFU (meet-em.ble.ir) relays DataChannel messages    │
│       ↓  ↑                                                   │
│  Server Side (exit node — dials real internet destinations)   │
└─────────────────────────────────────────────────────────────┘
```

## How It Works

1. Two Playwright-controlled Chrome browsers establish a Bale video call
2. Data is sent through LiveKit's WebRTC DataChannels (not the video stream)
3. The LiveKit SFU relays DataChannel messages between call participants
4. A SOCKS5/HTTP proxy on the client side accepts connections from apps
5. The server side dials real internet destinations and relays traffic back

**Throughput:** ~10+ KB/s via DataChannel (vs ~250 B/s with the legacy bitmap/VP9 encoding)

## Quick Start

### Server Side (the person with unrestricted internet)

```bash
# Interactive mode — prompts for each incoming call
node serve-cli.js

# Auto-answer mode — for background/tmux usage
node serve-cli.js --auto-answer

# With health checking disabled
node serve-cli.js --auto-answer --disable-health-check
```

The server opens Bale, monitors for incoming video calls, and auto-answers (or prompts). Once connected, it acts as an exit node.

### Client Side (the person with restricted internet)

```bash
# Using the bundle (includes Node.js, ffmpeg, everything)
./start.sh

# Or manually
cd bale-integration
node bridge.js --role caller --target <BALE_USER_ID> --ws-port 9000
# In another terminal:
./qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1080 --http :8080
```

Then configure Telegram (or any app): **SOCKS5 proxy → 127.0.0.1:1080**

## Features

- **LiveKit DataChannel transport** — bypasses VP9 video encoding entirely for reliable, fast data transfer
- **Bitmap fallback** — falls back to encoding data as grayscale blocks in video frames when DataChannel is unavailable
- **Bale integration** — full browser automation via Playwright (call, answer, video manipulation)
- **Interactive server CLI** — detects incoming calls, prompts to answer, shows colored status
- **Health monitoring** — checks Bale availability with exponential backoff, Tehran business hours awareness
- **Stats dashboard** — live TX/RX stats displayed on the video call canvas
- **SOCKS5 + HTTP proxy** — any app can tunnel through the video call
- **Stream multiplexing** — multiple TCP connections share one tunnel with independent flow control
- **Auto-recovery** — stream reaper, retransmit with caps, session restart on call end
- **Pure Go binary** — `CGO_ENABLED=0`, cross-compiles everywhere
- **Self-contained bundles** — distributable packages with Node.js, ffmpeg, Bale profile included

## Architecture

### Layer Stack

| Layer | Package | Purpose |
|-------|---------|---------|
| CLI | `cmd/qr-tunnel/` | `bale-client`, `bale-server`, `client`, `server`, `connect` |
| Server CLI | `serve-cli.js` | Interactive call management, health checking |
| HTTP Proxy | `internal/httpproxy/` | HTTP CONNECT proxy for Telegram |
| SOCKS5 | `internal/socks5/` | SOCKS5 proxy, IPv6 filtering, stream limiting |
| Transport | `internal/transport/` | Reliable multiplexed streams, retransmit, flow control, stream reaper |
| Bitmap Codec | `internal/bitmap/` | Grayscale block encoder/decoder (fallback mode) |
| Bale Provider | `internal/provider/bale/` | WebSocket bridge to Playwright, DataChannel support |
| WebRTC Provider | `internal/provider/webrtc/` | Direct pion/webrtc (for local testing) |
| Bridge | `bale-integration/bridge.js` | Playwright browser automation, DataChannel forwarding |

### DataChannel Transport (Primary)

```
Go binary → WebSocket (0xDC prefix) → bridge.js
  → LiveKit DataPacket protobuf → _reliable DataChannel
  → LiveKit SFU relays → remote _reliable DataChannel
  → bridge.js extracts payload → WebSocket (0xDC prefix) → Go binary
```

The `@livekit/protocol` SDK is bundled and injected into the browser page for correct protobuf serialization. The SFU relays `DataPacket` messages between participants.

### Bitmap Transport (Fallback)

```
Go binary → bitmap encoder (16×16 grayscale blocks, 720×720)
  → JPEG → WebSocket → bridge.js draws to canvas
  → VP9 encode → Bale SFU → VP9 decode
  → bridge.js captures canvas → JPEG → WebSocket → Go bitmap decoder
```

Used when DataChannel is not available. ~250 B/s throughput, 17% frame survival through VP9.

## Building

```bash
CGO_ENABLED=0 go build -o qr-tunnel ./cmd/qr-tunnel          # Current platform
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o qr-tunnel  # Linux
make build-all                                                  # All platforms
```

## Health Monitoring

The server CLI includes a Bale health checker:

- Checks `web.bale.ai` availability periodically
- **Exponential backoff**: 15s → 30s → 60s → 120s → up to 10 min
- **Tehran business hours** (7AM-6PM UTC+3:30): more aggressive checking
- Kills session after **60+ seconds** of continuous unavailability
- Auto-restarts when Bale comes back online

## Client Bundles

Self-contained packages for distribution (no installs needed except Chrome):

| Bundle | Contents | Size |
|--------|----------|------|
| Full (Linux) | qr-tunnel + Node.js + ffmpeg + Playwright deps + Bale profile | ~56 MB (xz) |
| Full (Windows) | qr-tunnel.exe + node.exe + ffmpeg.exe + deps + Bale profile | ~77 MB (zip) |

Generate bundles: see the bundle creation scripts in the project history.

## Configuration

### Server flags (`serve-cli.js`)

| Flag | Description |
|------|-------------|
| `--auto-answer` / `-a` | Answer calls automatically |
| `--disable-health-check` | Skip Bale availability monitoring |

### Client flags (`qr-tunnel bale-client`)

| Flag | Default | Description |
|------|---------|-------------|
| `--bridge` | `ws://localhost:9000` | Bridge WebSocket URL |
| `--socks5` | `:1080` | SOCKS5 proxy listen address |
| `--http` | `:8080` | HTTP CONNECT proxy address |
| `--block-size` | `16` | Bitmap block size (fallback mode) |
| `--bits-per-block` | `1` | Bits per block (fallback mode) |

## License

MIT
