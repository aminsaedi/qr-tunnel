package transport

import (
	"bytes"
	"fmt"
	"hash/crc32"
	"io"
	"log"
	"sync"
	"sync/atomic"
	"time"
)

type streamState int

const (
	streamStateSynSent streamState = iota
	streamStateOpen
	streamStateFinSent
	streamStateClosed
)

// Stream represents a single logical byte stream over the transport.
type Stream struct {
	ID        uint16
	transport *Transport
	state     streamState

	// Send side
	sendSeq   atomic.Uint32
	sendBuf   []pendingSegment
	sendMu    sync.Mutex
	ackCh     chan uint32

	// Receive side — ordered reassembly
	recvBuf    bytes.Buffer
	recvMu     sync.Mutex
	recvNotify chan struct{}
	recvSeq    uint32            // cumulative in-order ack number
	recvNext   uint32            // next expected seq for ordered delivery
	recvQueue  map[uint32][]byte // out-of-order segments waiting for reassembly
	needsAck   bool
	ackPending int               // count of unacked DATA frames (for batching)

	// SYN payload (connection metadata)
	synPayload []byte

	// Lifecycle
	opened chan struct{} // closed when SYN+ACK received
	closed atomic.Bool
	doneCh chan struct{} // closed when stream is fully done
}

type pendingSegment struct {
	seqNum  uint32
	data    []byte
	sentAt  time.Time
	retries int
}

func newStream(id uint16, t *Transport) *Stream {
	return &Stream{
		ID:         id,
		transport:  t,
		state:      streamStateSynSent,
		ackCh:      make(chan uint32, 64),
		recvNotify: make(chan struct{}, 1),
		recvNext:   1, // DATA seqs start at 1 (0 is SYN)
		recvQueue:  make(map[uint32][]byte),
		opened:     make(chan struct{}),
		doneCh:     make(chan struct{}),
	}
}

// WaitOpen waits for the stream to be opened (SYN+ACK received).
func (s *Stream) WaitOpen(timeout time.Duration) error {
	select {
	case <-s.opened:
		return nil
	case <-time.After(timeout):
		return fmt.Errorf("stream %d: open timeout", s.ID)
	}
}

// maxInFlight limits unACKed frames per stream. This prevents any single stream
// from flooding the send queue, keeping round-trip latency low for all streams.
// At ~1 frame/sec through Bale VP9, 4 in-flight = ~4 seconds of data.
const maxInFlight = 4

// Write sends data over the stream.
func (s *Stream) Write(data []byte) (int, error) {
	if s.closed.Load() {
		return 0, io.ErrClosedPipe
	}

	// Fragment into chunks
	maxPayload := s.transport.config.BitmapConfig.MaxPayloadBytes()
	maxChunk := maxPayload - 19 // subtract transport header size
	if maxChunk < 50 {
		maxChunk = 50
	}
	written := 0

	for written < len(data) {
		if s.closed.Load() {
			return written, io.ErrClosedPipe
		}

		// Flow control: wait if too many frames in flight (unACKed)
		for i := 0; i < 100; i++ {
			s.sendMu.Lock()
			inFlight := len(s.sendBuf)
			s.sendMu.Unlock()
			if inFlight < maxInFlight {
				break
			}
			// Wait for ACKs to drain the send buffer
			time.Sleep(150 * time.Millisecond)
			if s.closed.Load() {
				return written, io.ErrClosedPipe
			}
		}

		end := written + maxChunk
		if end > len(data) {
			end = len(data)
		}
		// Copy chunk data — the caller's buffer (from io.Copy) may be reused
		// before the transport layer encodes this frame.
		chunk := make([]byte, end-written)
		copy(chunk, data[written:end])

		seq := s.sendSeq.Add(1)

		s.sendMu.Lock()
		s.sendBuf = append(s.sendBuf, pendingSegment{
			seqNum: seq,
			data:   chunk,
			sentAt: time.Now(),
		})
		s.sendMu.Unlock()

		// Queue for sending
		s.transport.sendQueue <- &transportFrame{
			Flags:      FlagDATA,
			StreamID:   s.ID,
			SeqNum:     seq,
			WindowSize: uint16(s.transport.config.WindowSize),
			Payload:    chunk,
		}

		s.transport.BytesSent.Add(int64(len(chunk)))
		written += len(chunk)
	}

	return written, nil
}

// Read reads data from the stream.
func (s *Stream) Read(buf []byte) (int, error) {
	for {
		s.recvMu.Lock()
		n, _ := s.recvBuf.Read(buf)
		s.recvMu.Unlock()

		if n > 0 {
			return n, nil
		}

		if s.closed.Load() {
			return 0, io.EOF
		}

		// Wait for data
		select {
		case <-s.recvNotify:
			continue
		case <-s.doneCh:
			return 0, io.EOF
		case <-time.After(30 * time.Second):
			if s.closed.Load() {
				return 0, io.EOF
			}
		}
	}
}

// SetSYNPayload sets the metadata sent with the SYN (e.g., dst_host:port).
func (s *Stream) SetSYNPayload(data []byte) {
	s.synPayload = data
}

// ReadSYNPayload reads the metadata received with the SYN.
func (s *Stream) ReadSYNPayload() []byte {
	return s.synPayload
}

func (s *Stream) handleData(seqNum uint32, data []byte) {
	s.recvMu.Lock()
	defer s.recvMu.Unlock()

	dataHash := crc32.ChecksumIEEE(data)
	log.Printf("[stream] handleData: stream=%d seq=%d data=%d bytes hash=%08x recvNext=%d", s.ID, seqNum, len(data), dataHash, s.recvNext)

	s.ackPending++
	// Batch ACKs: send after every 4 DATA frames to reduce ACK overhead.
	// Each ACK is 19 bytes in a ~960 byte frame — wasteful if sent alone.
	if s.ackPending >= 4 {
		s.needsAck = true
		s.ackPending = 0
	}

	if seqNum == s.recvNext {
		// In-order: write directly to buffer
		s.recvBuf.Write(data)
		s.recvNext++

		// Flush any queued out-of-order segments that are now in order
		for {
			queued, ok := s.recvQueue[s.recvNext]
			if !ok {
				break
			}
			s.recvBuf.Write(queued)
			delete(s.recvQueue, s.recvNext)
			s.recvNext++
		}
	} else if seqNum > s.recvNext {
		// Out of order: queue for later
		if _, exists := s.recvQueue[seqNum]; !exists {
			cp := make([]byte, len(data))
			copy(cp, data)
			s.recvQueue[seqNum] = cp
		}
	}
	// else: duplicate or old segment, ignore

	// ACK the cumulative in-order boundary (not the raw received seq).
	// This ensures the sender only removes segments that have been delivered in order.
	newAck := s.recvNext - 1
	if newAck > s.recvSeq {
		s.recvSeq = newAck
		// Always ACK when the in-order frontier advances (triggers retransmit of next gap)
		s.needsAck = true
		s.ackPending = 0
	}

	// Notify readers
	select {
	case s.recvNotify <- struct{}{}:
	default:
	}
}

func (s *Stream) handleAck(ackNum uint32) {
	s.sendMu.Lock()
	defer s.sendMu.Unlock()

	// Remove acknowledged segments
	var remaining []pendingSegment
	for _, seg := range s.sendBuf {
		if seg.seqNum > ackNum {
			remaining = append(remaining, seg)
		}
	}
	s.sendBuf = remaining
}

func (s *Stream) handleFin() {
	s.state = streamStateClosed
	s.close()
}

// getPendingFrames returns transport frames that need to be sent (retransmits + ACKs).
func (s *Stream) getPendingFrames() []*transportFrame {
	// Don't retransmit for closed streams
	if s.closed.Load() {
		return nil
	}

	var frames []*transportFrame

	// Send ACK if needed
	s.recvMu.Lock()
	if s.needsAck {
		frames = append(frames, &transportFrame{
			Flags:      FlagACK,
			StreamID:   s.ID,
			AckNum:     s.recvSeq,
			WindowSize: uint16(s.transport.config.WindowSize),
		})
		s.needsAck = false
	}
	s.recvMu.Unlock()

	// Only retransmit DATA segments once the stream is open.
	// The SYN was sent via sendQueue directly and is never in sendBuf,
	// so there is nothing useful to retransmit until we reach streamStateOpen.
	if s.state != streamStateOpen {
		return frames
	}

	// Check for retransmits
	s.sendMu.Lock()
	rtt := time.Duration(s.transport.RTTEstimate.Load())
	timeout := rtt * 2
	if timeout < s.transport.config.RetransmitMin {
		timeout = s.transport.config.RetransmitMin
	}

	now := time.Now()
	for i := range s.sendBuf {
		if now.Sub(s.sendBuf[i].sentAt) > timeout {
			s.sendBuf[i].sentAt = now
			s.sendBuf[i].retries++
			frames = append(frames, &transportFrame{
				Flags:      FlagDATA,
				StreamID:   s.ID,
				SeqNum:     s.sendBuf[i].seqNum,
				WindowSize: uint16(s.transport.config.WindowSize),
				Payload:    s.sendBuf[i].data,
			})
		}
	}
	s.sendMu.Unlock()

	return frames
}

// Close sends FIN and marks stream as closed.
func (s *Stream) Close() error {
	if s.closed.Load() {
		return nil
	}

	s.transport.sendQueue <- &transportFrame{
		Flags:    FlagFIN,
		StreamID: s.ID,
	}
	s.state = streamStateFinSent
	s.close()
	return nil
}

func (s *Stream) close() {
	if s.closed.CompareAndSwap(false, true) {
		close(s.doneCh)
	}
}
