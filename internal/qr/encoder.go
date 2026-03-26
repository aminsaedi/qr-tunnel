package qr

import (
	"context"
	"encoding/base64"
	"encoding/binary"
	"image"
	"image/color"
	"math/rand"
	"sync/atomic"

	qrcode "github.com/skip2/go-qrcode"
)

// EncoderConfig configures the QR encoder.
type EncoderConfig struct {
	Version         int    // QR version 1-40 (controls capacity)
	ErrorCorrection string // "L","M","Q","H"
	ChunkSize       int    // bytes per LT block
	FPS             int    // frames per second to generate
	FrameWidth      int    // output frame width (default 720)
	FrameHeight     int    // output frame height (default 720)
}

// DefaultEncoderConfig returns sensible defaults.
func DefaultEncoderConfig() EncoderConfig {
	return EncoderConfig{
		Version:         25,
		ErrorCorrection: "M",
		ChunkSize:       800,
		FPS:             15,
		FrameWidth:      720,
		FrameHeight:     720,
	}
}

// Encoder generates QR code frames from data using LT fountain codes.
type Encoder struct {
	config    EncoderConfig
	sessionID uint32
	rng       *rand.Rand

	// Metrics
	FramesSent atomic.Int64
}

func NewEncoder(config EncoderConfig) *Encoder {
	if config.FrameWidth == 0 {
		config.FrameWidth = 720
	}
	if config.FrameHeight == 0 {
		config.FrameHeight = 720
	}
	return &Encoder{
		config:    config,
		sessionID: rand.Uint32(),
		rng:       rand.New(rand.NewSource(rand.Int63())),
	}
}

// QR payload header format:
// [1B magic=0xAA][1B version=0x01]
// [4B session_id][4B seq_num]
// [2B total_source_blocks][2B lt_block_index]
// [4B lt_block_seed]
// [2B payload_len]
// [N bytes LT-encoded payload]
const qrHeaderSize = 20

func (e *Encoder) buildPayload(lt *LTEncoder, seqNum uint32) []byte {
	ltIndex, ltSeed, ltData := lt.NextBlock()

	payloadLen := len(ltData)
	buf := make([]byte, qrHeaderSize+payloadLen)

	buf[0] = 0xAA // magic
	buf[1] = 0x01 // version
	binary.BigEndian.PutUint32(buf[2:6], e.sessionID)
	binary.BigEndian.PutUint32(buf[6:10], seqNum)
	binary.BigEndian.PutUint16(buf[10:12], uint16(lt.NumSourceBlocks()))
	binary.BigEndian.PutUint16(buf[12:14], uint16(ltIndex))
	binary.BigEndian.PutUint32(buf[14:18], ltSeed)
	binary.BigEndian.PutUint16(buf[18:20], uint16(payloadLen))
	copy(buf[qrHeaderSize:], ltData)

	return buf
}

// eccLevel converts string to qrcode recovery level.
func (e *Encoder) eccLevel() qrcode.RecoveryLevel {
	switch e.config.ErrorCorrection {
	case "L":
		return qrcode.Low
	case "Q":
		return qrcode.High
	case "H":
		return qrcode.Highest
	default:
		return qrcode.Medium
	}
}

// Encode splits data into LT-coded blocks and returns a channel of *image.RGBA frames.
// Frames are produced indefinitely until ctx is cancelled (fountain code property).
func (e *Encoder) Encode(ctx context.Context, data []byte) (<-chan *image.RGBA, error) {
	// New session ID for each Encode call so decoder doesn't treat new data as duplicate
	e.sessionID = e.rng.Uint32()
	lt := NewLTEncoder(data, e.config.ChunkSize)
	ch := make(chan *image.RGBA, 4)

	go func() {
		defer close(ch)
		var seq uint32
		colorIdx := 0
		// Corner colors for frame-change detection
		cornerColors := []color.RGBA{
			{255, 0, 0, 255},
			{0, 255, 0, 255},
			{0, 0, 255, 255},
			{255, 255, 0, 255},
		}

		for {
			select {
			case <-ctx.Done():
				return
			default:
			}

			seq++
			payload := e.buildPayload(lt, seq)

			// Base64-encode payload for safe QR string encoding
			encoded := base64.StdEncoding.EncodeToString(payload)

			// Generate QR code image
			qr, err := qrcode.New(encoded, e.eccLevel())
			if err != nil {
				continue
			}
			qr.DisableBorder = false
			qrImg := qr.Image(680) // QR at 680x680

			// Create full frame with margins
			W := e.config.FrameWidth
			H := e.config.FrameHeight
			frame := image.NewRGBA(image.Rect(0, 0, W, H))

			// White background
			white := color.RGBA{255, 255, 255, 255}
			for y := 0; y < H; y++ {
				for x := 0; x < W; x++ {
					frame.SetRGBA(x, y, white)
				}
			}

			// Center QR code (20px margin on each side for 720-wide frame)
			offsetX := (W - 680) / 2
			offsetY := (H - 680) / 2
			bounds := qrImg.Bounds()
			for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
				for x := bounds.Min.X; x < bounds.Max.X; x++ {
					frame.Set(x+offsetX, y+offsetY, qrImg.At(x, y))
				}
			}

			// Frame change detector: colored rectangle in bottom-right
			cc := cornerColors[colorIdx%len(cornerColors)]
			colorIdx++
			for y := H - 20; y < H; y++ {
				for x := W - 40; x < W; x++ {
					frame.SetRGBA(x, y, cc)
				}
			}

			e.FramesSent.Add(1)

			select {
			case ch <- frame:
			case <-ctx.Done():
				return
			}
		}
	}()

	return ch, nil
}

// EncodeFrame generates a single QR frame for the given data payload.
// Useful for testing or one-shot encoding.
func (e *Encoder) EncodeFrame(data []byte) (*image.RGBA, error) {
	encoded := base64.StdEncoding.EncodeToString(data)
	qr, err := qrcode.New(encoded, e.eccLevel())
	if err != nil {
		return nil, err
	}
	qr.DisableBorder = false
	qrImg := qr.Image(680)

	W := e.config.FrameWidth
	H := e.config.FrameHeight
	frame := image.NewRGBA(image.Rect(0, 0, W, H))

	// White background
	white := color.RGBA{255, 255, 255, 255}
	for y := 0; y < H; y++ {
		for x := 0; x < W; x++ {
			frame.SetRGBA(x, y, white)
		}
	}

	// Center QR code
	offsetX := (W - 680) / 2
	offsetY := (H - 680) / 2
	bounds := qrImg.Bounds()
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			frame.Set(x+offsetX, y+offsetY, qrImg.At(x, y))
		}
	}

	return frame, nil
}
