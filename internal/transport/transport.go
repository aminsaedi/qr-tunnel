package transport

import (
	"context"
	"encoding/binary"
	"fmt"
	"hash/crc32"
	"image"
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/bitmap"
	"github.com/aminsaedi/qr-tunnel/internal/provider"
)

// Frame flags
const (
	FlagSYN  byte = 0x01
	FlagACK  byte = 0x02
	FlagFIN  byte = 0x04
	FlagDATA byte = 0x08
	FlagRST  byte = 0x10
)

// transportFrame is the wire format for a single transport frame.
// [1B flags][2B stream_id][4B seq_num][4B ack_num][2B window_size][2B payload_len][4B crc32][N payload]
const transportHeaderSize = 19

type transportFrame struct {
	Flags      byte
	StreamID   uint16
	SeqNum     uint32
	AckNum     uint32
	WindowSize uint16
	Payload    []byte
}

func encodeTransportFrame(f *transportFrame) []byte {
	buf := make([]byte, transportHeaderSize+len(f.Payload))
	buf[0] = f.Flags
	binary.BigEndian.PutUint16(buf[1:3], f.StreamID)
	binary.BigEndian.PutUint32(buf[3:7], f.SeqNum)
	binary.BigEndian.PutUint32(buf[7:11], f.AckNum)
	binary.BigEndian.PutUint16(buf[11:13], f.WindowSize)
	binary.BigEndian.PutUint16(buf[13:15], uint16(len(f.Payload)))
	// CRC32 placeholder at [15:19] — computed below
	copy(buf[transportHeaderSize:], f.Payload)
	// Compute CRC32 over the entire frame (with CRC field zeroed)
	checksum := crc32.ChecksumIEEE(buf)
	binary.BigEndian.PutUint32(buf[15:19], checksum)
	return buf
}

func decodeTransportFrame(data []byte) (*transportFrame, error) {
	if len(data) < transportHeaderSize {
		return nil, fmt.Errorf("frame too short: %d", len(data))
	}
	payloadLen := binary.BigEndian.Uint16(data[13:15])
	totalLen := transportHeaderSize + int(payloadLen)
	if totalLen > len(data) {
		return nil, fmt.Errorf("payload length mismatch: need %d have %d", totalLen, len(data))
	}

	// Verify CRC32
	storedCRC := binary.BigEndian.Uint32(data[15:19])
	// Zero out the CRC field for computation
	frameCopy := make([]byte, totalLen)
	copy(frameCopy, data[:totalLen])
	binary.BigEndian.PutUint32(frameCopy[15:19], 0)
	computedCRC := crc32.ChecksumIEEE(frameCopy)
	// Re-insert stored CRC for computation (we zeroed it)
	binary.BigEndian.PutUint32(frameCopy[15:19], storedCRC)

	if storedCRC != computedCRC {
		log.Printf("[transport] CRC FAIL: stored=%08x computed=%08x flags=0x%02x stream=%d payloadLen=%d totalLen=%d",
			storedCRC, computedCRC, data[0], binary.BigEndian.Uint16(data[1:3]), payloadLen, totalLen)
		return nil, fmt.Errorf("CRC mismatch: stored=%08x computed=%08x", storedCRC, computedCRC)
	}

	f := &transportFrame{
		Flags:      data[0],
		StreamID:   binary.BigEndian.Uint16(data[1:3]),
		SeqNum:     binary.BigEndian.Uint32(data[3:7]),
		AckNum:     binary.BigEndian.Uint32(data[7:11]),
		WindowSize: binary.BigEndian.Uint16(data[11:13]),
	}
	f.Payload = data[transportHeaderSize:totalLen]
	return f, nil
}

// Config holds transport layer configuration.
type Config struct {
	BitmapConfig  bitmap.Config
	FPS           int           // send-loop tick rate (default 15)
	WindowSize    int           // sliding window in KB (default 32)
	RetransmitMin time.Duration // minimum retransmit timeout (default 1s)
	AckInterval   time.Duration // ACK interval (default 200ms)
	AdaptiveRate  bool          // enable adaptive send rate (for Bale/VP9)
}

func DefaultConfig() Config {
	return Config{
		BitmapConfig:  bitmap.DefaultConfig(),
		FPS:           15,
		WindowSize:    32,
		RetransmitMin: 1 * time.Second, // Fast retransmit for VP9 frame loss
		AckInterval:   200 * time.Millisecond,
	}
}

// DataChannelProvider is an optional interface for providers that support
// raw DataChannel transport (bypassing bitmap encode/decode for higher throughput).
type DataChannelProvider interface {
	SendData(data []byte) error
	OnData(cb func([]byte))
}

// Transport provides reliable multiplexed streams over a bitmap channel.
type Transport struct {
	provider    provider.CallProvider
	encoder     *bitmap.Encoder
	decoder     *bitmap.Decoder
	config      Config
	seqNum      uint16
	streamIDGen atomic.Uint32 // shared stream ID generator
	streams     map[uint16]*Stream
	mu          sync.RWMutex
	sendQueue   chan *transportFrame
	acceptQueue chan *Stream
	ctx         context.Context
	cancel      context.CancelFunc

	// DataChannel direct send (bypasses bitmap encoding)
	sendDataDirect func(data []byte) error

	// Adaptive rate controller (nil if not enabled)
	adaptive *AdaptiveController

	// Metrics
	BytesSent     atomic.Int64
	BytesReceived atomic.Int64
	RTTEstimate   atomic.Int64 // nanoseconds
}

// NewTransport creates a transport layer over the given call provider.
func NewTransport(p provider.CallProvider, config Config) *Transport {
	ctx, cancel := context.WithCancel(context.Background())
	t := &Transport{
		provider:    p,
		encoder:     bitmap.NewEncoder(config.BitmapConfig),
		decoder:     bitmap.NewDecoder(config.BitmapConfig),
		config:      config,
		streams:     make(map[uint16]*Stream),
		sendQueue:   make(chan *transportFrame, 32),
		acceptQueue: make(chan *Stream, 16),
		ctx:         ctx,
		cancel:      cancel,
	}
	t.RTTEstimate.Store(int64(500 * time.Millisecond))

	// DataChannel mode: bypass bitmap encoding for direct binary transport
	if dcp, ok := p.(DataChannelProvider); ok {
		log.Printf("[transport] DataChannel provider detected — using direct DC transport")
		t.sendDataDirect = dcp.SendData
		dcp.OnData(func(data []byte) {
			t.handleIncomingData(data)
		})
	}

	// Enable adaptive rate controller for VP9 video codecs
	if config.AdaptiveRate {
		t.adaptive = newAdaptiveController(t.decoder, config.BitmapConfig.MaxPayloadBytes(), 200*time.Millisecond)
		go func() {
			ticker := time.NewTicker(1 * time.Second)
			defer ticker.Stop()
			for {
				select {
				case <-ctx.Done():
					return
				case <-ticker.C:
					t.adaptive.Evaluate()
				}
			}
		}()
	}

	// Wire up frame callbacks — decode bitmap frames in a goroutine
	// to prevent blocking the sendLoop (decoder is CPU-intensive)
	decodeCh := make(chan *image.RGBA, 10)
	p.OnFrame(func(f *provider.Frame) {
		select {
		case decodeCh <- f.Image:
		default:
			// Drop frame if decoder is busy
		}
	})
	go func() {
		for img := range decodeCh {
			_, payload, err := t.decoder.DecodeFrame(img)
			if err != nil {
				// Yield CPU to prevent starving the sendLoop goroutine
				time.Sleep(5 * time.Millisecond)
				continue
			}
			if payload != nil {
				t.handleIncomingData(payload)
			}
			// Brief yield — decode as fast as frames arrive
			time.Sleep(10 * time.Millisecond)
		}
	}()

	// Start send loop
	go t.sendLoop()

	// Start stream reaper — closes zombie streams that accumulate when
	// FIN packets get lost through VP9. Without this, hundreds of idle
	// streams generate retransmit traffic that starves active streams.
	go t.streamReaper()

	return t
}

// nextSeq returns the next bitmap sequence number.
func (t *Transport) nextSeq() uint16 {
	t.mu.Lock()
	seq := t.seqNum
	t.seqNum++
	t.mu.Unlock()
	return seq
}

// NextStreamID returns a unique stream ID. Use this for both SOCKS5 and HTTP proxy.
func (t *Transport) NextStreamID() uint16 {
	id := t.streamIDGen.Add(1)
	if id == 0 {
		id = t.streamIDGen.Add(1) // skip 0
	}
	return uint16(id)
}

// OpenStream creates a new outgoing stream with an optional SYN payload.
func (t *Transport) OpenStream(id uint16, synPayload ...[]byte) *Stream {
	t.mu.Lock()
	defer t.mu.Unlock()

	s := newStream(id, t)
	t.streams[id] = s

	// Send SYN (with payload if provided — carries destination address)
	var payload []byte
	if len(synPayload) > 0 {
		payload = synPayload[0]
	}
	s.synSentData = payload // store for retransmit
	t.sendQueue <- &transportFrame{
		Flags:      FlagSYN,
		StreamID:   id,
		WindowSize: uint16(t.config.WindowSize),
		Payload:    payload,
	}

	return s
}

// streamReaper periodically closes idle/zombie streams.
func (t *Transport) streamReaper() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-t.ctx.Done():
			return
		case <-ticker.C:
		}

		now := time.Now()
		var toClose []uint16

		t.mu.RLock()
		for id, s := range t.streams {
			if s.closed.Load() {
				toClose = append(toClose, id)
				continue
			}
			lastRecv := time.Unix(0, s.lastRecv.Load())
			idle := now.Sub(lastRecv)
			age := now.Sub(s.createdAt)

			// Close streams idle > 90s or older than 5 minutes
			// Telegram keeps connections open between messages — don't be too aggressive
			if idle > 90*time.Second || age > 5*time.Minute {
				toClose = append(toClose, id)
			}
		}
		t.mu.RUnlock()

		if len(toClose) > 0 {
			t.mu.Lock()
			for _, id := range toClose {
				if s, ok := t.streams[id]; ok {
					s.close()
					delete(t.streams, id)
				}
			}
			active := len(t.streams)
			t.mu.Unlock()
			log.Printf("[transport] reaper: closed %d streams, %d active", len(toClose), active)
		}
	}
}

// AcceptStream returns a channel of new incoming streams.
func (t *Transport) AcceptStream() <-chan *Stream {
	return t.acceptQueue
}

// Close shuts down the transport.
func (t *Transport) Close() {
	t.cancel()
	t.mu.Lock()
	for _, s := range t.streams {
		s.close()
	}
	t.mu.Unlock()
}

// handleIncomingData processes reassembled data from the bitmap decoder.
// The data may contain one or more packed transport frames.
func (t *Transport) handleIncomingData(data []byte) {
	offset := 0
	for offset < len(data) {
		if len(data)-offset < transportHeaderSize {
			break
		}
		// Stop at zero bytes (no valid transport frame starts with 3 zero bytes)
		// This was needed for LT fountain code padding; kept as safety check
		if offset+2 < len(data) && data[offset] == 0 && data[offset+1] == 0 && data[offset+2] == 0 {
			break
		}
		frame, err := decodeTransportFrame(data[offset:])
		if err != nil {
			break
		}
		offset += transportHeaderSize + len(frame.Payload)
		if frame.Flags != 0 {
			payloadHash := crc32.ChecksumIEEE(frame.Payload)
			log.Printf("[transport] rx: flags=0x%02x stream=%d seq=%d ack=%d payload=%d payloadHash=%08x",
				frame.Flags, frame.StreamID, frame.SeqNum, frame.AckNum, len(frame.Payload), payloadHash)
		}
		t.handleFrame(frame)
	}
}

func (t *Transport) handleFrame(f *transportFrame) {
	t.mu.RLock()
	stream, exists := t.streams[f.StreamID]
	t.mu.RUnlock()

	// Handle SYN for new incoming streams
	if f.Flags&FlagSYN != 0 && !exists {
		t.mu.Lock()
		stream = newStream(f.StreamID, t)
		stream.state = streamStateOpen
		t.streams[f.StreamID] = stream
		t.mu.Unlock()

		// Send SYN+ACK (retransmitted by getPendingFrames if lost)
		select {
		case t.sendQueue <- &transportFrame{
			Flags:      FlagSYN | FlagACK,
			StreamID:   f.StreamID,
			WindowSize: uint16(t.config.WindowSize),
		}:
		default:
		}

		// Store the SYN payload as connection metadata (not in recvBuf)
		if len(f.Payload) > 0 {
			stream.synPayload = make([]byte, len(f.Payload))
			copy(stream.synPayload, f.Payload)
		}

		select {
		case t.acceptQueue <- stream:
		default:
			log.Printf("[transport] accept queue full, dropping stream %d", f.StreamID)
		}
		return
	}

	if !exists {
		return
	}

	// Handle SYN+ACK (stream opened successfully)
	if f.Flags&(FlagSYN|FlagACK) == FlagSYN|FlagACK {
		if stream.state == streamStateSynSent {
			stream.state = streamStateOpen
			log.Printf("[transport] stream %d: SYN+ACK received, opening", f.StreamID)
			close(stream.opened)
		}
		return
	}

	// Handle ACK
	if f.Flags&FlagACK != 0 {
		stream.handleAck(f.AckNum)
	}

	// Handle DATA
	if f.Flags&FlagDATA != 0 && len(f.Payload) > 0 {
		stream.handleData(f.SeqNum, f.Payload)
		t.BytesReceived.Add(int64(len(f.Payload)))
	}

	// Handle FIN — close and remove stream
	if f.Flags&FlagFIN != 0 {
		stream.handleFin()
		t.mu.Lock()
		delete(t.streams, f.StreamID)
		t.mu.Unlock()
	}

	// Handle RST — close and remove stream
	if f.Flags&FlagRST != 0 {
		stream.close()
		t.mu.Lock()
		delete(t.streams, f.StreamID)
		t.mu.Unlock()
	}
}

// sendLoop pulls frames from the send queue and sends them.
func (t *Transport) sendLoop() {
	iteration := 0
	fixedTick := 100 * time.Millisecond
	// In DataChannel mode, tick much faster for lower latency
	if t.sendDataDirect != nil {
		fixedTick = 5 * time.Millisecond
	}
	for {
		select {
		case <-t.ctx.Done():
			return
		default:
		}

		iteration++
		if iteration%20 == 1 {
			tick := fixedTick
			if t.adaptive != nil {
				tick = t.adaptive.TickInterval()
			}
			log.Printf("[sendLoop] tick #%d, queue=%d, interval=%dms", iteration, len(t.sendQueue), tick.Milliseconds())
		}

		t.sendPendingFrames()

		// Use adaptive tick if available
		if t.adaptive != nil {
			time.Sleep(t.adaptive.TickInterval())
		} else {
			time.Sleep(fixedTick)
		}
	}
}

// sendPendingFrames packs and sends one batch of transport frames. Returns true if data was sent.
func (t *Transport) sendPendingFrames() bool {
	maxPayload := t.config.BitmapConfig.MaxPayloadBytes()
	// In DataChannel mode, we can send much larger messages (DC limit ~256KB)
	if t.sendDataDirect != nil {
		maxPayload = 64 * 1024 // 64KB per batch — well within DC limits
	}
	var packed []byte
	queueLen := len(t.sendQueue)

	// PRIORITY 1: New data from queue (fresh SYNs, DATA, FINs)
	for {
		select {
		case frame := <-t.sendQueue:
			encoded := encodeTransportFrame(frame)
			if len(packed)+len(encoded) > maxPayload {
				select {
				case t.sendQueue <- frame:
				default:
				}
				goto fillRetransmits
			}
			packed = append(packed, encoded...)
		default:
			goto fillRetransmits
		}
	}
fillRetransmits:

	// PRIORITY 2: Fill remaining space with ACKs and retransmits
	t.mu.RLock()
	for _, s := range t.streams {
		for _, f := range s.getPendingFrames() {
			encoded := encodeTransportFrame(f)
			if len(packed)+len(encoded) > maxPayload {
				break
			}
			packed = append(packed, encoded...)
		}
	}
	t.mu.RUnlock()

	if len(packed) > 0 {
		if queueLen > 0 {
			log.Printf("[transport] sendPending: queue=%d packed=%d bytes", queueLen, len(packed))
		}
		t.sendData(packed)
		return true
	}
	return false
}

func (t *Transport) sendData(data []byte) {
	// DataChannel mode: send raw transport frames directly (no bitmap encoding)
	if t.sendDataDirect != nil {
		if err := t.sendDataDirect(data); err == nil {
			t.BytesSent.Add(int64(len(data)))
		} else {
			log.Printf("[transport] DC send error: %v", err)
		}
		return
	}

	// Legacy bitmap mode: encode into image frame
	img := t.encoder.EncodePacket(t.nextSeq(), data)
	if img == nil {
		return
	}
	frame := &provider.Frame{
		Image:  img,
		Width:  bitmap.FrameWidth,
		Height: bitmap.FrameHeight,
	}
	if err := t.provider.SendFrame(frame); err == nil {
		t.BytesSent.Add(int64(len(data)))
		if t.adaptive != nil {
			t.adaptive.FramesSent.Add(1)
		}
	}
}

// Metrics returns current transport metrics.
type Metrics struct {
	BytesSent     int64
	BytesReceived int64
	RTTEstimate   time.Duration
	ActiveStreams  int
	DecodeRate    float64 // fraction of frames successfully decoded
	DCMode        bool    // true if using DataChannel transport
}

func (t *Transport) Metrics() Metrics {
	t.mu.RLock()
	activeStreams := len(t.streams)
	t.mu.RUnlock()

	var decodeRate float64
	processed := t.decoder.FramesProcessed.Load()
	if processed > 0 {
		decodeRate = float64(t.decoder.FramesDecoded.Load()) / float64(processed)
	}

	return Metrics{
		BytesSent:     t.BytesSent.Load(),
		BytesReceived: t.BytesReceived.Load(),
		RTTEstimate:   time.Duration(t.RTTEstimate.Load()),
		ActiveStreams:  activeStreams,
		DecodeRate:    decodeRate,
		DCMode:        t.sendDataDirect != nil,
	}
}
