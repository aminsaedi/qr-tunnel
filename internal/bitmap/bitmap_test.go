package bitmap

import (
	"crypto/rand"
	"image"
	"testing"
)

func TestRoundTrip(t *testing.T) {
	cfg := DefaultConfig()
	enc := NewEncoder(cfg)
	dec := NewDecoder(cfg)

	maxPayload := enc.MaxPayload()
	t.Logf("Config: block=%d bits=%d grid=%dx%d inner=%dx%d dataBlocks=%d maxPayload=%d",
		cfg.BlockSize, cfg.BitsPerBlock, cfg.GridSize(), cfg.GridSize(),
		cfg.InnerGridSize(), cfg.InnerGridSize(), cfg.DataBlocks(), maxPayload)

	sizes := []int{1, 10, 50, 100, 200, maxPayload}
	for i, size := range sizes {
		payload := make([]byte, size)
		if _, err := rand.Read(payload); err != nil {
			t.Fatal(err)
		}

		seqNum := uint16(i + 1)
		img := enc.EncodePacket(seqNum, payload)
		if img == nil {
			t.Fatalf("EncodePacket returned nil for %d bytes", size)
		}

		seq, decoded, err := dec.DecodeFrame(img) //nolint:errcheck
		if err != nil {
			t.Fatalf("DecodeFrame failed for %d bytes: %v", size, err)
		}

		if seq != seqNum {
			t.Errorf("seq mismatch: got %d want %d", seq, seqNum)
		}

		if len(decoded) != len(payload) {
			t.Fatalf("length mismatch: got %d want %d", len(decoded), len(payload))
		}

		for i := range payload {
			if decoded[i] != payload[i] {
				t.Fatalf("byte %d mismatch: got %02x want %02x", i, decoded[i], payload[i])
			}
		}
	}
	t.Logf("All %d sizes passed round-trip", len(sizes))
}

func TestDuplicateDetection(t *testing.T) {
	cfg := DefaultConfig()
	enc := NewEncoder(cfg)
	dec := NewDecoder(cfg)

	payload := []byte("hello world")
	img := enc.EncodePacket(1, payload)

	// First decode should succeed
	_, _, err := dec.DecodeFrame(img) //nolint:errcheck
	if err != nil {
		t.Fatalf("first decode failed: %v", err)
	}

	// Second decode of same seq should be detected as duplicate
	_, _, err = dec.DecodeFrame(img) //nolint:errcheck
	if err == nil {
		t.Fatal("expected duplicate detection")
	}
}

func TestRejectNonBitmapFrame(t *testing.T) {
	cfg := DefaultConfig()
	dec := NewDecoder(cfg)

	// Create a blank white image (not a bitmap frame)
	img := makeBlankImage(255)
	_, _, err := dec.DecodeFrame(img) //nolint:errcheck
	if err == nil {
		t.Fatal("expected error for non-bitmap frame")
	}
}

func TestMaxPayloadExceeded(t *testing.T) {
	cfg := DefaultConfig()
	enc := NewEncoder(cfg)

	// Try encoding more than max payload
	payload := make([]byte, enc.MaxPayload()+1)
	img := enc.EncodePacket(1, payload)
	if img != nil {
		t.Fatal("expected nil for oversized payload")
	}
}

func TestFallbackBlockSize(t *testing.T) {
	cfg := Config{BlockSize: FallbackBlockSize, BitsPerBlock: DefaultBitsPerBlock}
	enc := NewEncoder(cfg)
	dec := NewDecoder(cfg)

	t.Logf("Fallback config: maxPayload=%d", cfg.MaxPayloadBytes())

	payload := make([]byte, 100)
	rand.Read(payload) //nolint:errcheck

	img := enc.EncodePacket(99, payload)
	seq, decoded, err := dec.DecodeFrame(img) //nolint:errcheck
	if err != nil {
		t.Fatalf("fallback decode failed: %v", err)
	}
	if seq != 99 {
		t.Errorf("seq: got %d want 99", seq)
	}
	for i := range payload {
		if decoded[i] != payload[i] {
			t.Fatalf("byte %d mismatch", i)
		}
	}
}

func BenchmarkEncode(b *testing.B) {
	cfg := DefaultConfig()
	enc := NewEncoder(cfg)
	payload := make([]byte, 200)
	rand.Read(payload) //nolint:errcheck

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		enc.EncodePacket(uint16(i), payload)
	}
}

func BenchmarkDecode(b *testing.B) {
	cfg := DefaultConfig()
	enc := NewEncoder(cfg)
	dec := NewDecoder(cfg)
	payload := make([]byte, 200)
	rand.Read(payload) //nolint:errcheck
	img := enc.EncodePacket(0, payload)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		dec.lastSeq = 0 // reset duplicate detection
		dec.DecodeFrame(img) //nolint:errcheck
	}
}

func makeBlankImage(lum uint8) *image.RGBA {
	img := image.NewRGBA(image.Rect(0, 0, FrameWidth, FrameHeight))
	for y := 0; y < FrameHeight; y++ {
		for x := 0; x < FrameWidth; x++ {
			img.Pix[(y*FrameWidth+x)*4+0] = lum
			img.Pix[(y*FrameWidth+x)*4+1] = lum
			img.Pix[(y*FrameWidth+x)*4+2] = lum
			img.Pix[(y*FrameWidth+x)*4+3] = 255
		}
	}
	return img
}
