package bale

import (
	"bytes"
	"context"
	"encoding/binary"
	"fmt"
	"image"
	"image/jpeg"
	"log"
	"sync"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/provider"
	"github.com/coder/websocket"
)

const frameHeaderSize = 8

// BaleProvider implements provider.CallProvider by connecting to a browser
// bridge WebSocket. The browser handles the actual Bale video call, and
// this provider exchanges JPEG-encoded video frames over the WS.
type BaleProvider struct {
	conn    *websocket.Conn
	onFrame func(*provider.Frame)
	onState func(provider.State)
	state   provider.State
	seq     uint32
	txCount int
	rxCount int
	mu      sync.Mutex
	ctx     context.Context
	cancel  context.CancelFunc
}

func NewBaleProvider() *BaleProvider {
	return &BaleProvider{
		state: provider.StateDisconnected,
	}
}

func (p *BaleProvider) Connect(bridgeURL string, opts provider.CallOptions) error {
	p.ctx, p.cancel = context.WithCancel(context.Background())
	p.setState(provider.StateConnecting)

	log.Printf("[bale] connecting to bridge at %s", bridgeURL)

	// Connect to the browser bridge WebSocket
	conn, _, err := websocket.Dial(p.ctx, bridgeURL, &websocket.DialOptions{
		CompressionMode: websocket.CompressionDisabled,
	})
	if err != nil {
		p.setState(provider.StateFailed)
		return fmt.Errorf("bridge connect: %w", err)
	}
	p.conn = conn
	conn.SetReadLimit(1 << 20) // 1MB

	log.Printf("[bale] connected to bridge, waiting for call...")

	// Start reading frames from bridge
	go p.readLoop()

	// Wait for "connected" signal from bridge (call established)
	// The readLoop will update state when it receives the signal
	timeout := time.After(300 * time.Second) // 5 min — call setup may need manual interaction
	for {
		if p.state == provider.StateConnected {
			log.Printf("[bale] call connected, frames flowing")
			return nil
		}
		if p.state == provider.StateFailed {
			return fmt.Errorf("call failed")
		}
		select {
		case <-timeout:
			log.Printf("[bale] timeout waiting for call — continuing (call may connect later)")
			return nil
		case <-p.ctx.Done():
			return p.ctx.Err()
		case <-time.After(500 * time.Millisecond):
			// poll state
		}
	}
}

func (p *BaleProvider) readLoop() {
	for {
		msgType, data, err := p.conn.Read(p.ctx)
		if err != nil {
			if p.ctx.Err() != nil {
				return
			}
			log.Printf("[bale] bridge read error: %v", err)
			p.setState(provider.StateDisconnected)
			return
		}

		if msgType == websocket.MessageText {
			// Control message
			msg := string(data)
			switch {
			case msg == "connected":
				log.Printf("[bale] bridge: call connected")
				p.setState(provider.StateConnected)
			case msg == "disconnected":
				log.Printf("[bale] bridge: call disconnected")
				p.setState(provider.StateDisconnected)
			case msg == "ringing":
				log.Printf("[bale] bridge: ringing...")
			default:
				log.Printf("[bale] bridge: %s", msg)
			}
			continue
		}

		// Binary message: video frame [4B seq][2B width][2B height][JPEG data]
		if len(data) <= frameHeaderSize {
			continue
		}

		if p.onFrame == nil {
			continue
		}

		width := int(binary.BigEndian.Uint16(data[4:6]))
		height := int(binary.BigEndian.Uint16(data[6:8]))
		jpegData := data[frameHeaderSize:]

		img, err := jpeg.Decode(bytes.NewReader(jpegData))
		if err != nil {
			continue
		}

		rgba, ok := img.(*image.RGBA)
		if !ok {
			bounds := img.Bounds()
			rgba = image.NewRGBA(bounds)
			for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
				for x := bounds.Min.X; x < bounds.Max.X; x++ {
					rgba.Set(x, y, img.At(x, y))
				}
			}
		}

		p.onFrame(&provider.Frame{
			Image:  rgba,
			Width:  width,
			Height: height,
		})
		p.rxCount++
		if p.rxCount%30 == 1 {
			log.Printf("[bale] rx frame #%d (%dx%d, %d bytes JPEG)", p.rxCount, width, height, len(jpegData))
		}
	}
}

func (p *BaleProvider) SendFrame(frame *provider.Frame) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.conn == nil {
		return fmt.Errorf("not connected")
	}

	var buf bytes.Buffer
	buf.Grow(frameHeaderSize + frame.Width*frame.Height)

	header := make([]byte, frameHeaderSize)
	p.seq++
	binary.BigEndian.PutUint32(header[0:4], p.seq)
	binary.BigEndian.PutUint16(header[4:6], uint16(frame.Width))
	binary.BigEndian.PutUint16(header[6:8], uint16(frame.Height))
	buf.Write(header)

	if err := jpeg.Encode(&buf, frame.Image, &jpeg.Options{Quality: 75}); err != nil {
		return fmt.Errorf("jpeg encode: %w", err)
	}

	err := p.conn.Write(p.ctx, websocket.MessageBinary, buf.Bytes())
	p.txCount++
	if p.txCount%30 == 1 {
		log.Printf("[bale] tx frame #%d (%dx%d, %d bytes)", p.txCount, frame.Width, frame.Height, buf.Len())
	}
	return err
}

func (p *BaleProvider) OnFrame(cb func(*provider.Frame)) {
	p.onFrame = cb
}

func (p *BaleProvider) OnState(cb func(provider.State)) {
	p.onState = cb
}

func (p *BaleProvider) LocalDescription() string {
	return ""
}

func (p *BaleProvider) Close() error {
	if p.cancel != nil {
		p.cancel()
	}
	if p.conn != nil {
		return p.conn.Close(websocket.StatusNormalClosure, "bye")
	}
	return nil
}

func (p *BaleProvider) setState(state provider.State) {
	p.state = state
	if p.onState != nil {
		p.onState(state)
	}
}
