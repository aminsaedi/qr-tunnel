package qr

import (
	"encoding/base64"
	"encoding/binary"
	"image"
	"image/color"
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/makiuchi-d/gozxing"
	"github.com/makiuchi-d/gozxing/qrcode"
)

// Decoder processes incoming video frames and extracts QR-encoded data.
type Decoder struct {
	onData   func(sessionID uint32, data []byte)
	sessions map[uint32]*decodeSession
	mu       sync.Mutex

	// Frame change detection
	lastCornerColor color.RGBA

	// Metrics
	FramesProcessed atomic.Int64
	FramesDecoded   atomic.Int64
	FramesFailed    atomic.Int64

	lastDecodeTime time.Time
}

type decodeSession struct {
	decoder   *LTDecoder
	lastSeen  time.Time
	completed bool
}

func NewDecoder(onData func(sessionID uint32, data []byte)) *Decoder {
	d := &Decoder{
		onData:   onData,
		sessions: make(map[uint32]*decodeSession),
	}

	// Start session cleanup goroutine
	go d.cleanupLoop()
	return d
}

// ProcessFrame processes one incoming video frame, attempting QR decode.
func (d *Decoder) ProcessFrame(frame *image.RGBA) {
	count := d.FramesProcessed.Add(1)

	// Skip duplicate frame check for now — video codec changes pixels every frame
	// so the corner color detector doesn't work reliably through compression

	// Convert to grayscale for QR scanning
	gray := binarize(frame)

	// Attempt QR decode
	b64Data, err := decodeQR(gray)
	if err != nil {
		d.FramesFailed.Add(1)
		if count%100 == 1 {
			log.Printf("[qr-decoder] frame #%d: QR decode failed: %v", count, err)
		}
		return
	}

	log.Printf("[qr-decoder] frame #%d: QR DECODED! (%d bytes b64)", count, len(b64Data))

	// Base64 decode to get binary payload
	payload, err := base64.StdEncoding.DecodeString(string(b64Data))
	if err != nil {
		d.FramesFailed.Add(1)
		log.Printf("[qr-decoder] frame #%d: base64 decode failed: %v (data: %s)", count, err, string(b64Data)[:min(50, len(b64Data))])
		return
	}

	d.FramesDecoded.Add(1)
	d.lastDecodeTime = time.Now()

	// Parse the payload header
	d.processPayload(payload)
}

// isDuplicateFrame checks the corner color rectangle for frame changes.
func (d *Decoder) isDuplicateFrame(frame *image.RGBA) bool {
	bounds := frame.Bounds()
	W := bounds.Max.X
	H := bounds.Max.Y

	// Sample the bottom-right corner (40x20 colored rectangle)
	if W < 40 || H < 20 {
		return false
	}
	c := frame.RGBAAt(W-20, H-10)

	if c == d.lastCornerColor {
		return true
	}
	d.lastCornerColor = c
	return false
}

// processPayload parses a decoded QR payload and feeds it to the LT decoder.
func (d *Decoder) processPayload(payload []byte) {
	if len(payload) < qrHeaderSize {
		log.Printf("[qr-decoder] processPayload: too short (%d < %d)", len(payload), qrHeaderSize)
		return
	}

	magic := payload[0]
	version := payload[1]
	if magic != 0xAA || version != 0x01 {
		log.Printf("[qr-decoder] processPayload: bad magic/version: 0x%02x 0x%02x", magic, version)
		return
	}
	log.Printf("[qr-decoder] processPayload: valid header, %d bytes", len(payload))

	sessionID := binary.BigEndian.Uint32(payload[2:6])
	// seqNum := binary.BigEndian.Uint32(payload[6:10])
	totalSourceBlocks := binary.BigEndian.Uint16(payload[10:12])
	ltBlockIndex := binary.BigEndian.Uint16(payload[12:14])
	ltBlockSeed := binary.BigEndian.Uint32(payload[14:18])
	payloadLen := binary.BigEndian.Uint16(payload[18:20])

	if int(payloadLen) > len(payload)-qrHeaderSize {
		return
	}

	ltData := payload[qrHeaderSize : qrHeaderSize+int(payloadLen)]

	d.mu.Lock()
	session, ok := d.sessions[sessionID]
	if !ok {
		session = &decodeSession{
			decoder:  NewLTDecoder(int(totalSourceBlocks), len(ltData)),
			lastSeen: time.Now(),
		}
		d.sessions[sessionID] = session
	}
	session.lastSeen = time.Now()

	if session.completed {
		d.mu.Unlock()
		return
	}

	session.decoder.AddBlock(uint32(ltBlockIndex), ltBlockSeed, ltData)
	log.Printf("[qr-decoder] LT block added: session=%d blocks=%d/%d complete=%v",
		sessionID, ltBlockIndex, totalSourceBlocks, session.decoder.IsComplete())

	if session.decoder.IsComplete() {
		session.completed = true
		data, err := session.decoder.Decode()
		d.mu.Unlock()

		log.Printf("[qr-decoder] LT DECODE COMPLETE! session=%d data=%d bytes err=%v", sessionID, len(data), err)
		if err == nil && d.onData != nil {
			d.onData(sessionID, data)
		}
		return
	}
	d.mu.Unlock()
}

// cleanupLoop removes stale sessions.
func (d *Decoder) cleanupLoop() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		d.mu.Lock()
		now := time.Now()
		for id, s := range d.sessions {
			if now.Sub(s.lastSeen) > 30*time.Second {
				delete(d.sessions, id)
			}
		}
		d.mu.Unlock()
	}
}

// DecodeSuccessRate returns the fraction of processed frames that decoded successfully.
func (d *Decoder) DecodeSuccessRate() float64 {
	processed := d.FramesProcessed.Load()
	if processed == 0 {
		return 0
	}
	return float64(d.FramesDecoded.Load()) / float64(processed)
}

// binarize converts an RGBA image to grayscale using Otsu's method for adaptive thresholding.
func binarize(img *image.RGBA) *image.Gray {
	bounds := img.Bounds()
	gray := image.NewGray(bounds)

	// First pass: convert to grayscale and build histogram
	var histogram [256]int
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			// Luminance formula (fast approximation)
			lum := uint8((r*299 + g*587 + b*114) / 1000 >> 8)
			gray.SetGray(x, y, color.Gray{Y: lum})
			histogram[lum]++
		}
	}

	// Otsu's method: find optimal threshold
	total := bounds.Dx() * bounds.Dy()
	var sumTotal float64
	for i := 0; i < 256; i++ {
		sumTotal += float64(i) * float64(histogram[i])
	}

	var sumBg float64
	var weightBg int
	maxVariance := 0.0
	threshold := uint8(128)

	for t := 0; t < 256; t++ {
		weightBg += histogram[t]
		if weightBg == 0 {
			continue
		}
		weightFg := total - weightBg
		if weightFg == 0 {
			break
		}

		sumBg += float64(t) * float64(histogram[t])
		meanBg := sumBg / float64(weightBg)
		meanFg := (sumTotal - sumBg) / float64(weightFg)

		variance := float64(weightBg) * float64(weightFg) * (meanBg - meanFg) * (meanBg - meanFg)
		if variance > maxVariance {
			maxVariance = variance
			threshold = uint8(t)
		}
	}

	// Second pass: apply threshold
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			if gray.GrayAt(x, y).Y > threshold {
				gray.SetGray(x, y, color.Gray{Y: 255})
			} else {
				gray.SetGray(x, y, color.Gray{Y: 0})
			}
		}
	}

	return gray
}

// decodeQR attempts to decode a QR code from a grayscale image.
func decodeQR(gray *image.Gray) ([]byte, error) {
	bmp, err := gozxing.NewBinaryBitmapFromImage(gray)
	if err != nil {
		return nil, err
	}

	reader := qrcode.NewQRCodeReader()
	result, err := reader.Decode(bmp, nil)
	if err != nil {
		return nil, err
	}

	return []byte(result.GetText()), nil
}

// DecoderStats returns current decoder statistics.
type DecoderStats struct {
	FramesProcessed int64
	FramesDecoded   int64
	FramesFailed    int64
	SuccessRate     float64
	ActiveSessions  int
}

func (d *Decoder) Stats() DecoderStats {
	d.mu.Lock()
	activeSessions := len(d.sessions)
	d.mu.Unlock()

	processed := d.FramesProcessed.Load()
	decoded := d.FramesDecoded.Load()

	var rate float64
	if processed > 0 {
		rate = float64(decoded) / float64(processed)
	}

	return DecoderStats{
		FramesProcessed: processed,
		FramesDecoded:   decoded,
		FramesFailed:    d.FramesFailed.Load(),
		SuccessRate:     rate,
		ActiveSessions:  activeSessions,
	}
}

func init() {
	// Suppress verbose logs from gozxing
	_ = log.Default()
}
