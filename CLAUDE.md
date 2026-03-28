# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**qr-tunnel** — tunnels TCP traffic through Bale messenger video calls using LiveKit WebRTC DataChannels. Provides SOCKS5/HTTP proxy for apps like Telegram to access restricted internet.

Module: `github.com/aminsaedi/qr-tunnel`

## Build & Test Commands

```bash
CGO_ENABLED=0 go build -o qr-tunnel ./cmd/qr-tunnel   # Build binary
go test ./internal/bitmap/ -v -race -timeout 60s        # Bitmap codec tests
go test ./internal/bitmap/ -v -run TestBitmapSurvivesVP9 # VP9 survival tests

# Server (your side — answers calls, provides internet)
node serve-cli.js --auto-answer

# Client (friend's side — initiates call, gets proxy)
cd bale-integration && node bridge.js --role caller --target 884923192 --ws-port 9000
./qr-tunnel bale-client --bridge ws://localhost:9000 --socks5 :1080 --http :8080
```

## Critical Constraint: Pure Go, No CGo

Every Go dependency must be pure Go. `CGO_ENABLED=0 go build ./cmd/qr-tunnel` must work.

## Architecture

### Two Transport Modes

**DataChannel (primary, ~10+ KB/s):** Data goes through LiveKit's WebRTC DataChannel, bypassing video encoding entirely. Uses `@livekit/protocol` SDK for correct DataPacket protobuf serialization. The SFU relays messages between participants.

**Bitmap (fallback, ~250 B/s):** Encodes data as 16×16 grayscale blocks in 720×720 video frames. Survives VP9 compression with ~17% decode rate. Used when DataChannel is not available.

### Data Flow (DataChannel mode)

```
App → SOCKS5 (:1080) → Transport (mux streams) → BaleProvider.SendData()
  → WebSocket (0xDC prefix) → bridge.js → LiveKit DataPacket protobuf
  → _reliable DataChannel → SFU relays → remote DataChannel
  → bridge.js extracts payload → WebSocket → BaleProvider.OnData()
  → Transport → SOCKS5 server → real internet
```

### Key Abstractions

**`CallProvider` interface** (`internal/provider/provider.go`): All transport code talks to this. WebRTC and Bale providers implement it.

**`DataChannelProvider` interface** (`internal/transport/transport.go`): Optional extension for providers that support direct binary transport (bypasses bitmap encode/decode).

**`BaleProvider`** (`internal/provider/bale/provider.go`): WebSocket bridge to Playwright browser. Supports both JPEG frame exchange (bitmap mode) and raw DataChannel forwarding (DC mode). Uses `0xDC` prefix byte to distinguish DC messages from legacy JPEG frames.

### Layer Stack

| Layer | Package | Role |
|---|---|---|
| CLI | `cmd/qr-tunnel/` | `bale-client`, `bale-server`, `client`, `server` |
| Server CLI | `serve-cli.js` | Interactive call management, health checking |
| HTTP Proxy | `internal/httpproxy/` | HTTP CONNECT, IPv6 filtering, stream limiting |
| SOCKS5 | `internal/socks5/` | SOCKS5 CONNECT, IPv6 filtering |
| Transport | `internal/transport/` | Multiplexed reliable streams, cumulative ACK, retransmit with caps, stream reaper |
| Bitmap | `internal/bitmap/` | Grayscale block encode/decode, VP9 survival |
| Bale Provider | `internal/provider/bale/` | WS bridge, DC mode detection |
| Bridge | `bale-integration/bridge.js` | Playwright automation, DC forwarding, stats dashboard, call detection |

### Bridge (bridge.js) Key Details

- **INIT_SCRIPT**: Injected before page load. Hooks `RTCPeerConnection` to capture DataChannels, overrides `getUserMedia` for canvas transform pipeline, adds stats renderer.
- **LiveKit protocol**: `lk-protocol-bundle.js` (esbuild bundle of `@livekit/protocol`) injected via `addInitScript` for DataPacket encoding/decoding.
- **DataChannel forwarding**: Sends on publisher's `_reliable` DC, receives on subscriber's `_reliable` DC. Messages wrapped as `DataPacket { user: UserPacket { payload } }`.
- **Call automation**: `findAndClick()` uses TreeWalker text matching + mouse.click. Callee detects "Answer" text, clicks it and "Answer Call". Falls back to interactive prompt if auto-click fails.
- **Stats dashboard**: `__drawTunnelStats()` renders TX/RX data, speed, mode on the canvas that replaces the camera feed.

### Transport Layer Details

- **Cumulative ACK**: ACKs report `recvNext - 1` (in-order frontier), not raw received seq
- **Retransmit cap**: Max 30 retries per frame, then drop (prevents stale retransmit flooding)
- **Stream reaper**: Closes streams idle >90s or older than 5 min (prevents zombie accumulation when FINs are lost)
- **Non-blocking Write**: If sendQueue is full, frame stays in sendBuf for retransmit instead of blocking
- **SYN retransmit**: Single retry at 3-4 seconds after creation
- **DC mode**: 5ms tick, 64KB batch size (vs 100ms tick, ~221 byte bitmap payload)

### Health Checker (serve-cli.js)

- Monitors `https://web.bale.ai/` with HTTPS GET
- Exponential backoff: 15s → 30s → 60s → 120s → max (2 min biz, 10 min off-hours)
- Tehran business hours (7AM-6PM UTC+3:30): more aggressive checking
- Kills session after 60+ seconds of continuous failure
- Auto-recovers when Bale comes back

## Bale Account Profiles

- `bale-analysis/profile-a/` — Hossein's account (caller/client)
- `bale-analysis/profile-b/` — Amin's account (callee/server)
- `bale-analysis/profile-bahram/` — Bahram's account (Windows client)
- Tokens valid ~1 year (cookie-based, Chromium encrypted per-machine)

## CLI Modes

- `bale-client` — SOCKS5 + HTTP proxy via Bale call. Default: 16×16 blocks, 1-bit, DataChannel enabled
- `bale-server` — Exit node via Bale call. Accepts streams, dials real destinations
- `client` / `server` — Direct WebRTC mode (for local testing without Bale)
- `connect` — Debug mode with optional `--test-frames` and `--gui`
