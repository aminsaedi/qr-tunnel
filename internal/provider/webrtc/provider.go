package webrtc

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

	"github.com/AminKhosroAli/qr-tunnel/internal/provider"
	"github.com/pion/webrtc/v3"
)

// frameHeader is prepended to each JPEG frame sent over DataChannel.
// [4B sequence][2B width][2B height] = 8 bytes
const frameHeaderSize = 8

// WebRTCProvider implements provider.CallProvider using pion/webrtc with DataChannels.
// Frames are JPEG-encoded and sent/received over a "frames" DataChannel.
type WebRTCProvider struct {
	pc        *webrtc.PeerConnection
	dc        *webrtc.DataChannel
	signaling *SignalingClient
	onFrame   func(*provider.Frame)
	onState   func(provider.State)
	state     provider.State
	seq       uint32
	mu        sync.Mutex
	localSDP  string
	ctx       context.Context
	cancel    context.CancelFunc
}

func NewWebRTCProvider() *WebRTCProvider {
	return &WebRTCProvider{
		state: provider.StateDisconnected,
	}
}

func (p *WebRTCProvider) Connect(signalingURL string, opts provider.CallOptions) error {
	p.ctx, p.cancel = context.WithCancel(context.Background())

	// Connect to signaling server
	p.signaling = NewSignalingClient(signalingURL)
	if err := p.signaling.Connect(p.ctx); err != nil {
		return fmt.Errorf("signaling: %w", err)
	}

	// Create PeerConnection
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{URLs: []string{"stun:stun.l.google.com:19302"}},
		},
	}
	pc, err := webrtc.NewPeerConnection(config)
	if err != nil {
		return fmt.Errorf("create peer connection: %w", err)
	}
	p.pc = pc

	// Track connection state
	pc.OnICEConnectionStateChange(func(state webrtc.ICEConnectionState) {
		log.Printf("[webrtc] ICE state: %s", state.String())
		switch state {
		case webrtc.ICEConnectionStateChecking:
			p.setState(provider.StateConnecting)
		case webrtc.ICEConnectionStateConnected, webrtc.ICEConnectionStateCompleted:
			p.setState(provider.StateConnected)
		case webrtc.ICEConnectionStateFailed:
			p.setState(provider.StateFailed)
		case webrtc.ICEConnectionStateDisconnected, webrtc.ICEConnectionStateClosed:
			p.setState(provider.StateDisconnected)
		}
	})

	// Handle incoming DataChannels (callee side)
	pc.OnDataChannel(func(dc *webrtc.DataChannel) {
		log.Printf("[webrtc] received data channel: %s", dc.Label())
		if dc.Label() == "frames" {
			p.setupDataChannel(dc)
		}
	})

	// Handle ICE candidates
	pc.OnICECandidate(func(c *webrtc.ICECandidate) {
		if c == nil {
			return
		}
		iceJSON := c.ToJSON()
		payload, _ := marshalJSON(iceJSON)
		if err := p.signaling.Send(SignalingMessage{Type: "ice", Payload: payload}); err != nil {
			log.Printf("[webrtc] failed to send ICE: %v", err)
		}
	})

	// Handle signaling messages
	connected := make(chan struct{}, 1)
	p.signaling.OnMessage(func(msg SignalingMessage) {
		switch msg.Type {
		case "welcome":
			log.Printf("[signaling] welcome: peer %d, %d connected", msg.PeerIndex, msg.PeersConnected)
		case "peer-joined":
			log.Printf("[signaling] peer joined (%d total)", msg.PeersConnected)
			// If caller role and peer just joined, create offer
			if opts.Role == "caller" {
				go p.createAndSendOffer()
			}
		case "offer":
			go p.handleOffer(msg.Payload)
		case "answer":
			go p.handleAnswer(msg.Payload)
		case "ice":
			go p.handleICE(msg.Payload)
		case "peer-left":
			log.Printf("[signaling] peer left")
			p.setState(provider.StateDisconnected)
		}
	})

	p.setState(provider.StateConnecting)

	// If caller, create the DataChannel and offer
	if opts.Role == "caller" {
		dc, err := pc.CreateDataChannel("frames", &webrtc.DataChannelInit{})
		if err != nil {
			return fmt.Errorf("create data channel: %w", err)
		}
		p.setupDataChannel(dc)
		// Don't send offer yet — wait for peer-joined signal
	}

	// Wait for connection or timeout
	go func() {
		pc.OnICEConnectionStateChange(func(state webrtc.ICEConnectionState) {
			if state == webrtc.ICEConnectionStateConnected || state == webrtc.ICEConnectionStateCompleted {
				select {
				case connected <- struct{}{}:
				default:
				}
			}
		})
	}()

	select {
	case <-connected:
		log.Printf("[webrtc] connected!")
	case <-time.After(30 * time.Second):
		log.Printf("[webrtc] connection timeout — continuing anyway (peer may join later)")
	case <-p.ctx.Done():
		return p.ctx.Err()
	}

	return nil
}

func (p *WebRTCProvider) createAndSendOffer() {
	offer, err := p.pc.CreateOffer(nil)
	if err != nil {
		log.Printf("[webrtc] create offer error: %v", err)
		return
	}
	if err := p.pc.SetLocalDescription(offer); err != nil {
		log.Printf("[webrtc] set local desc error: %v", err)
		return
	}
	p.localSDP = offer.SDP

	payload, _ := marshalJSON(offer)
	if err := p.signaling.Send(SignalingMessage{Type: "offer", Payload: payload}); err != nil {
		log.Printf("[webrtc] send offer error: %v", err)
	}
	log.Printf("[signaling] sent offer")
}

func (p *WebRTCProvider) handleOffer(payload []byte) {
	var offer webrtc.SessionDescription
	if err := unmarshalJSON(payload, &offer); err != nil {
		log.Printf("[webrtc] parse offer error: %v", err)
		return
	}
	if err := p.pc.SetRemoteDescription(offer); err != nil {
		log.Printf("[webrtc] set remote desc error: %v", err)
		return
	}
	log.Printf("[signaling] received offer, creating answer")

	answer, err := p.pc.CreateAnswer(nil)
	if err != nil {
		log.Printf("[webrtc] create answer error: %v", err)
		return
	}
	if err := p.pc.SetLocalDescription(answer); err != nil {
		log.Printf("[webrtc] set local desc error: %v", err)
		return
	}
	p.localSDP = answer.SDP

	answerPayload, _ := marshalJSON(answer)
	if err := p.signaling.Send(SignalingMessage{Type: "answer", Payload: answerPayload}); err != nil {
		log.Printf("[webrtc] send answer error: %v", err)
	}
	log.Printf("[signaling] sent answer")
}

func (p *WebRTCProvider) handleAnswer(payload []byte) {
	var answer webrtc.SessionDescription
	if err := unmarshalJSON(payload, &answer); err != nil {
		log.Printf("[webrtc] parse answer error: %v", err)
		return
	}
	if err := p.pc.SetRemoteDescription(answer); err != nil {
		log.Printf("[webrtc] set remote desc error: %v", err)
		return
	}
	log.Printf("[signaling] received answer")
}

func (p *WebRTCProvider) handleICE(payload []byte) {
	var candidate webrtc.ICECandidateInit
	if err := unmarshalJSON(payload, &candidate); err != nil {
		log.Printf("[webrtc] parse ICE error: %v", err)
		return
	}
	if err := p.pc.AddICECandidate(candidate); err != nil {
		log.Printf("[webrtc] add ICE error: %v", err)
	}
}

func (p *WebRTCProvider) setupDataChannel(dc *webrtc.DataChannel) {
	p.mu.Lock()
	p.dc = dc
	p.mu.Unlock()

	dc.OnOpen(func() {
		log.Printf("[webrtc] data channel '%s' opened", dc.Label())
	})

	dc.OnMessage(func(msg webrtc.DataChannelMessage) {
		if !msg.IsString && len(msg.Data) > frameHeaderSize {
			p.handleFrameMessage(msg.Data)
		}
	})

	dc.OnClose(func() {
		log.Printf("[webrtc] data channel '%s' closed", dc.Label())
	})

	dc.OnError(func(err error) {
		log.Printf("[webrtc] data channel error: %v", err)
	})
}

func (p *WebRTCProvider) handleFrameMessage(data []byte) {
	if p.onFrame == nil {
		return
	}

	// Parse header: [4B seq][2B width][2B height][JPEG data]
	width := int(binary.BigEndian.Uint16(data[4:6]))
	height := int(binary.BigEndian.Uint16(data[6:8]))
	jpegData := data[frameHeaderSize:]

	img, err := jpeg.Decode(bytes.NewReader(jpegData))
	if err != nil {
		// Silently drop corrupt frames
		return
	}

	// Convert to RGBA if needed
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
}

func (p *WebRTCProvider) SendFrame(frame *provider.Frame) error {
	p.mu.Lock()
	dc := p.dc
	p.mu.Unlock()

	if dc == nil || dc.ReadyState() != webrtc.DataChannelStateOpen {
		return fmt.Errorf("data channel not open")
	}

	// Encode frame as JPEG
	var buf bytes.Buffer
	buf.Grow(frameHeaderSize + frame.Width*frame.Height) // rough estimate

	// Write header
	header := make([]byte, frameHeaderSize)
	p.seq++
	binary.BigEndian.PutUint32(header[0:4], p.seq)
	binary.BigEndian.PutUint16(header[4:6], uint16(frame.Width))
	binary.BigEndian.PutUint16(header[6:8], uint16(frame.Height))
	buf.Write(header)

	// Encode JPEG with quality tuned for QR readability (high contrast)
	if err := jpeg.Encode(&buf, frame.Image, &jpeg.Options{Quality: 90}); err != nil {
		return fmt.Errorf("jpeg encode: %w", err)
	}

	return dc.Send(buf.Bytes())
}

func (p *WebRTCProvider) OnFrame(cb func(*provider.Frame)) {
	p.onFrame = cb
}

func (p *WebRTCProvider) OnState(cb func(provider.State)) {
	p.onState = cb
}

func (p *WebRTCProvider) LocalDescription() string {
	return p.localSDP
}

func (p *WebRTCProvider) Close() error {
	if p.cancel != nil {
		p.cancel()
	}
	if p.signaling != nil {
		p.signaling.Close()
	}
	if p.pc != nil {
		return p.pc.Close()
	}
	return nil
}

func (p *WebRTCProvider) setState(state provider.State) {
	p.state = state
	if p.onState != nil {
		p.onState(state)
	}
}
