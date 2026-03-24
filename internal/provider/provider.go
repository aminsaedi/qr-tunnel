package provider

import "image"

// State represents the connection state of a call provider.
type State int

const (
	StateDisconnected State = iota
	StateConnecting
	StateConnected
	StateFailed
)

func (s State) String() string {
	switch s {
	case StateDisconnected:
		return "disconnected"
	case StateConnecting:
		return "connecting"
	case StateConnected:
		return "connected"
	case StateFailed:
		return "failed"
	default:
		return "unknown"
	}
}

// CallOptions configures the call provider connection.
type CallOptions struct {
	Role   string // "caller" or "callee"
	RoomID string
}

// Frame represents one video frame (RGBA, fixed size).
type Frame struct {
	Image  *image.RGBA
	Width  int
	Height int
}

// CallProvider abstracts the video call mechanism.
type CallProvider interface {
	Connect(signalingURL string, opts CallOptions) error
	SendFrame(frame *Frame) error
	OnFrame(cb func(*Frame))
	OnState(cb func(State))
	LocalDescription() string
	Close() error
}
