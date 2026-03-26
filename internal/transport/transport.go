package transport

import (
	"context"
	"encoding/binary"
	"fmt"
	"hash/crc32"
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/provider"
	"github.com/aminsaedi/qr-tunnel/internal/qr"
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
	QRConfig      qr.EncoderConfig
	WindowSize    int           // sliding window in KB (default 32)
	RetransmitMin time.Duration // minimum retransmit timeout (default 1s)
	AckInterval   time.Duration // ACK interval (default 200ms)
}

func DefaultConfig() Config {
	return Config{
		QRConfig:      qr.DefaultEncoderConfig(),
		WindowSize:    32,
		RetransmitMin: 1 * time.Second,
		AckInterval:   200 * time.Millisecond,
	}
}

// Transport provides reliable multiplexed streams over a QR channel.
type Transport struct {
	provider    provider.CallProvider
	encoder     *qr.Encoder
	decoder     *qr.Decoder
	config      Config
	streams     map[uint16]*Stream
	mu          sync.RWMutex
	sendQueue   chan *transportFrame
	acceptQueue chan *Stream
	ctx         context.Context
	cancel      context.CancelFunc

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
		encoder:     qr.NewEncoder(config.QRConfig),
		config:      config,
		streams:     make(map[uint16]*Stream),
		sendQueue:   make(chan *transportFrame, 256),
		acceptQueue: make(chan *Stream, 16),
		ctx:         ctx,
		cancel:      cancel,
	}
	t.RTTEstimate.Store(int64(500 * time.Millisecond))

	// Set up QR decoder for incoming data
	t.decoder = qr.NewDecoder(func(sessionID uint32, data []byte) {
		t.handleIncomingData(data)
	})

	// Wire up frame callbacks
	p.OnFrame(func(f *provider.Frame) {
		t.decoder.ProcessFrame(f.Image)
	})

	// Start send loop
	go t.sendLoop()

	return t
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
	t.sendQueue <- &transportFrame{
		Flags:      FlagSYN,
		StreamID:   id,
		WindowSize: uint16(t.config.WindowSize),
		Payload:    payload,
	}

	return s
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

// handleIncomingData processes reassembled data from the QR decoder.
// The data may contain one or more packed transport frames.
func (t *Transport) handleIncomingData(data []byte) {
	offset := 0
	parsed := 0
	for offset < len(data) {
		if len(data)-offset < transportHeaderSize {
			break
		}
		frame, err := decodeTransportFrame(data[offset:])
		if err != nil {
			// CRC failure or corrupt frame — skip remaining data
			break
		}
		offset += transportHeaderSize + len(frame.Payload)
		parsed++
		if frame.Flags != 0 { // Don't log zero-padding frames
			log.Printf("[transport] rx: flags=0x%02x stream=%d seq=%d ack=%d payload=%d",
				frame.Flags, frame.StreamID, frame.SeqNum, frame.AckNum, len(frame.Payload))
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

		// Send SYN+ACK
		t.sendQueue <- &transportFrame{
			Flags:      FlagSYN | FlagACK,
			StreamID:   f.StreamID,
			WindowSize: uint16(t.config.WindowSize),
		}

		// Deliver the SYN payload (connection metadata like dst host:port)
		if len(f.Payload) > 0 {
			stream.recvBuf.Write(f.Payload)
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

	// Handle FIN
	if f.Flags&FlagFIN != 0 {
		stream.handleFin()
	}

	// Handle RST
	if f.Flags&FlagRST != 0 {
		stream.close()
	}
}

// sendLoop pulls frames from the send queue and encodes them into QR frames.
// Only sends 1 QR frame per tick to give each frame time on the canvas.
func (t *Transport) sendLoop() {
	// Tick at half the FPS rate — each QR stays on screen for 2 video frames
	// This gives the other side's capture more time to read each code
	interval := time.Second / time.Duration(t.config.QRConfig.FPS) * 2
	if interval < 100*time.Millisecond {
		interval = 100 * time.Millisecond
	}
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-t.ctx.Done():
			return
		case <-ticker.C:
			t.sendPendingFrames()
		}
	}
}

func (t *Transport) sendPendingFrames() {
	// Pack frames greedily up to chunk size, but only send ONE QR per tick.
	// This gives each QR frame time on the canvas for the other side to capture.
	maxPayload := t.config.QRConfig.ChunkSize
	var packed []byte

	// Take frames from the queue (prioritize new data)
	for {
		select {
		case frame := <-t.sendQueue:
			encoded := encodeTransportFrame(frame)
			if len(packed)+len(encoded) > maxPayload {
				// Batch is full — send it and save this frame for next tick
				if len(packed) > 0 {
					t.sendData(packed)
					// Re-queue the frame that didn't fit (non-blocking)
					select {
					case t.sendQueue <- frame:
					default:
					}
					return // Only 1 sendData per tick
				}
				packed = encoded
			} else {
				packed = append(packed, encoded...)
			}
		default:
			goto doneQueue
		}
	}
doneQueue:

	// If nothing from queue, check retransmits and ACKs
	if len(packed) == 0 {
		t.mu.RLock()
		for _, s := range t.streams {
			for _, f := range s.getPendingFrames() {
				encoded := encodeTransportFrame(f)
				if len(packed)+len(encoded) > maxPayload {
					break // Don't overflow
				}
				packed = append(packed, encoded...)
			}
		}
		t.mu.RUnlock()
	}

	if len(packed) > 0 {
		t.sendData(packed)
	}
}

func (t *Transport) sendData(data []byte) {
	// Encode the packed transport frames into QR and send via provider.
	// We send exactly 1 QR frame per call. The draw loop continuously
	// redraws the current frame (__goFrame), so the receiver captures it
	// multiple times from the video feed — no need to burst duplicates.
	ctx, cancel := context.WithTimeout(t.ctx, time.Second)
	defer cancel()

	frames, err := t.encoder.Encode(ctx, data)
	if err != nil {
		return
	}

	// Take the first encoded frame and send it once.
	select {
	case frame, ok := <-frames:
		if !ok {
			return
		}
		if err := t.provider.SendFrame(&provider.Frame{
			Image:  frame,
			Width:  t.config.QRConfig.FrameWidth,
			Height: t.config.QRConfig.FrameHeight,
		}); err == nil {
			t.BytesSent.Add(int64(len(data)))
		}
	case <-ctx.Done():
		return
	}
	// Cancel the encoder goroutine — we only needed one frame.
	cancel()
}

// Metrics returns current transport metrics.
type Metrics struct {
	BytesSent     int64
	BytesReceived int64
	RTTEstimate   time.Duration
	ActiveStreams  int
	EncoderStats  qr.DecoderStats
}

func (t *Transport) Metrics() Metrics {
	t.mu.RLock()
	activeStreams := len(t.streams)
	t.mu.RUnlock()

	return Metrics{
		BytesSent:     t.BytesSent.Load(),
		BytesReceived: t.BytesReceived.Load(),
		RTTEstimate:   time.Duration(t.RTTEstimate.Load()),
		ActiveStreams:  activeStreams,
		EncoderStats:  t.decoder.Stats(),
	}
}
