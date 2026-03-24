package webrtc

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"nhooyr.io/websocket"
)

// SignalingMessage represents a signaling message exchanged between peers.
type SignalingMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
	// Extra fields from server
	PeerIndex      int `json:"peerIndex,omitempty"`
	PeersConnected int `json:"peersConnected,omitempty"`
}

// SignalingClient handles WebSocket communication with the signaling server.
type SignalingClient struct {
	url    string
	conn   *websocket.Conn
	ctx    context.Context
	cancel context.CancelFunc
	mu     sync.Mutex
	onMsg  func(SignalingMessage)
}

func NewSignalingClient(url string) *SignalingClient {
	return &SignalingClient{url: url}
}

func (s *SignalingClient) Connect(ctx context.Context) error {
	s.ctx, s.cancel = context.WithCancel(ctx)
	conn, _, err := websocket.Dial(s.ctx, s.url, nil)
	if err != nil {
		return fmt.Errorf("signaling connect: %w", err)
	}
	s.conn = conn
	// Increase read limit for SDP messages
	s.conn.SetReadLimit(1 << 20) // 1MB

	go s.readLoop()
	return nil
}

func (s *SignalingClient) readLoop() {
	for {
		_, data, err := s.conn.Read(s.ctx)
		if err != nil {
			if s.ctx.Err() != nil {
				return // context cancelled
			}
			log.Printf("[signaling] read error: %v", err)
			return
		}

		var msg SignalingMessage
		if err := json.Unmarshal(data, &msg); err != nil {
			log.Printf("[signaling] invalid JSON: %v", err)
			continue
		}

		if s.onMsg != nil {
			s.onMsg(msg)
		}
	}
}

func (s *SignalingClient) Send(msg SignalingMessage) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}
	return s.conn.Write(s.ctx, websocket.MessageText, data)
}

func (s *SignalingClient) OnMessage(cb func(SignalingMessage)) {
	s.onMsg = cb
}

func (s *SignalingClient) Close() error {
	if s.cancel != nil {
		s.cancel()
	}
	if s.conn != nil {
		return s.conn.Close(websocket.StatusNormalClosure, "bye")
	}
	return nil
}
