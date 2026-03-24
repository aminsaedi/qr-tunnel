package transport

import (
	"context"
	"encoding/binary"
	"fmt"
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
// [1B flags][2B stream_id][4B seq_num][4B ack_num][2B window_size][2B payload_len][N payload]
const transportHeaderSize = 15

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
	copy(buf[transportHeaderSize:], f.Payload)
	return buf
}

func decodeTransportFrame(data []byte) (*transportFrame, error) {
	if len(data) < transportHeaderSize {
		return nil, fmt.Errorf("frame too short: %d", len(data))
	}
	f := &transportFrame{
		Flags:      data[0],
		StreamID:   binary.BigEndian.Uint16(data[1:3]),
		SeqNum:     binary.BigEndian.Uint32(data[3:7]),
		AckNum:     binary.BigEndian.Uint32(data[7:11]),
		WindowSize: binary.BigEndian.Uint16(data[11:13]),
	}
	payloadLen := binary.BigEndian.Uint16(data[13:15])
	if int(payloadLen) > len(data)-transportHeaderSize {
		return nil, fmt.Errorf("payload length mismatch")
	}
	f.Payload = data[transportHeaderSize : transportHeaderSize+int(payloadLen)]
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
	nextID      atomic.Uint32
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

// OpenStream creates a new outgoing stream.
func (t *Transport) OpenStream(id uint16) *Stream {
	t.mu.Lock()
	defer t.mu.Unlock()

	s := newStream(id, t)
	t.streams[id] = s

	// Send SYN
	t.sendQueue <- &transportFrame{
		Flags:      FlagSYN,
		StreamID:   id,
		WindowSize: uint16(t.config.WindowSize),
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
	for offset < len(data) {
		if len(data)-offset < transportHeaderSize {
			break
		}
		frame, err := decodeTransportFrame(data[offset:])
		if err != nil {
			break
		}
		offset += transportHeaderSize + len(frame.Payload)
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
		stream.state = streamStateOpen
		close(stream.opened)
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
func (t *Transport) sendLoop() {
	ticker := time.NewTicker(time.Second / time.Duration(t.config.QRConfig.FPS))
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
	// Collect frames to send (pack greedily up to chunk size)
	maxPayload := t.config.QRConfig.ChunkSize
	var packed []byte

	// Drain send queue
	for {
		select {
		case frame := <-t.sendQueue:
			encoded := encodeTransportFrame(frame)
			if len(packed)+len(encoded) > maxPayload {
				// Send what we have, re-queue this frame
				if len(packed) > 0 {
					t.sendData(packed)
				}
				packed = encoded
			} else {
				packed = append(packed, encoded...)
			}
		default:
			// Also check for retransmits and ACKs from streams
			t.mu.RLock()
			for _, s := range t.streams {
				frames := s.getPendingFrames()
				for _, f := range frames {
					encoded := encodeTransportFrame(f)
					if len(packed)+len(encoded) > maxPayload {
						if len(packed) > 0 {
							t.sendData(packed)
						}
						packed = encoded
					} else {
						packed = append(packed, encoded...)
					}
				}
			}
			t.mu.RUnlock()

			if len(packed) > 0 {
				t.sendData(packed)
			}
			return
		}
	}
}

func (t *Transport) sendData(data []byte) {
	// Encode the packed transport frames into QR and send via provider
	ctx, cancel := context.WithTimeout(t.ctx, time.Second)
	defer cancel()

	frames, err := t.encoder.Encode(ctx, data)
	if err != nil {
		return
	}

	// Send a burst of frames (LT coded redundancy)
	count := 0
	for frame := range frames {
		if err := t.provider.SendFrame(&provider.Frame{
			Image:  frame,
			Width:  t.config.QRConfig.FrameWidth,
			Height: t.config.QRConfig.FrameHeight,
		}); err != nil {
			continue
		}
		count++
		t.BytesSent.Add(int64(len(data)))

		// Send enough frames for the LT codes to work with some redundancy
		numBlocks := (len(data) / t.config.QRConfig.ChunkSize) + 1
		if count >= numBlocks*2 {
			break
		}
	}
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
