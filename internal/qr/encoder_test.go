package qr

import (
	"bytes"
	"context"
	"crypto/rand"
	"sync"
	"testing"
	"time"
)

func TestEncoderDecoderRoundTrip(t *testing.T) {
	// Generate test data
	original := make([]byte, 5000)
	rand.Read(original)

	config := DefaultEncoderConfig()
	config.ChunkSize = 200 // smaller chunks for test
	enc := NewEncoder(config)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	frames, err := enc.Encode(ctx, original)
	if err != nil {
		t.Fatal(err)
	}

	var received []byte
	var mu sync.Mutex
	done := make(chan struct{})

	dec := NewDecoder(func(sessionID uint32, data []byte) {
		mu.Lock()
		received = data
		mu.Unlock()
		close(done)
	})

	// Feed frames to decoder until complete
	go func() {
		for frame := range frames {
			dec.ProcessFrame(frame)
		}
	}()

	select {
	case <-done:
		// Success
	case <-ctx.Done():
		stats := dec.Stats()
		t.Fatalf("timeout: processed=%d decoded=%d failed=%d rate=%.2f",
			stats.FramesProcessed, stats.FramesDecoded, stats.FramesFailed, stats.SuccessRate)
	}

	mu.Lock()
	defer mu.Unlock()

	// Trim padding from last block
	if len(received) > len(original) {
		received = received[:len(original)]
	}

	if !bytes.Equal(original, received) {
		t.Fatal("decoded data does not match original")
	}

	stats := dec.Stats()
	t.Logf("round trip complete: %d frames processed, %d decoded, success rate: %.1f%%",
		stats.FramesProcessed, stats.FramesDecoded, stats.SuccessRate*100)
}

func TestEncoderDecoderWithFrameLoss(t *testing.T) {
	original := make([]byte, 10000)
	rand.Read(original)

	config := DefaultEncoderConfig()
	config.ChunkSize = 200
	enc := NewEncoder(config)

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	frames, err := enc.Encode(ctx, original)
	if err != nil {
		t.Fatal(err)
	}

	var received []byte
	var mu sync.Mutex
	done := make(chan struct{})

	dec := NewDecoder(func(sessionID uint32, data []byte) {
		mu.Lock()
		received = data
		mu.Unlock()
		close(done)
	})

	// Feed frames with 30% loss
	go func() {
		i := 0
		for frame := range frames {
			i++
			// Drop 30% of frames
			if i%10 < 3 {
				continue
			}
			dec.ProcessFrame(frame)
		}
	}()

	select {
	case <-done:
	case <-ctx.Done():
		stats := dec.Stats()
		t.Fatalf("timeout with 30%% loss: processed=%d decoded=%d rate=%.2f",
			stats.FramesProcessed, stats.FramesDecoded, stats.SuccessRate)
	}

	mu.Lock()
	defer mu.Unlock()

	if len(received) > len(original) {
		received = received[:len(original)]
	}

	if !bytes.Equal(original, received) {
		t.Fatal("decoded data does not match original after frame loss")
	}

	stats := dec.Stats()
	t.Logf("with 30%% frame loss: %d processed, %d decoded, success rate: %.1f%%",
		stats.FramesProcessed, stats.FramesDecoded, stats.SuccessRate*100)
}
