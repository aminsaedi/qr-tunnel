package qr

import (
	"bytes"
	"crypto/rand"
	"testing"
)

func TestLTCodesRoundTrip(t *testing.T) {
	sizes := []int{100, 1000, 5000, 50000}
	blockSize := 200

	for _, size := range sizes {
		t.Run("", func(t *testing.T) {
			// Generate random data
			original := make([]byte, size)
			if _, err := rand.Read(original); err != nil {
				t.Fatal(err)
			}

			enc := NewLTEncoder(original, blockSize)
			dec := NewLTDecoder(enc.NumSourceBlocks(), blockSize)

			// Feed blocks until complete (with some overhead)
			maxBlocks := enc.NumSourceBlocks() * 5
			for i := 0; i < maxBlocks && !dec.IsComplete(); i++ {
				index, seed, data := enc.NextBlock()
				dec.AddBlock(index, seed, data)
			}

			if !dec.IsComplete() {
				t.Fatalf("decoding not complete after %d blocks (source blocks: %d)",
					maxBlocks, enc.NumSourceBlocks())
			}

			decoded, err := dec.Decode()
			if err != nil {
				t.Fatal(err)
			}

			// Trim to original size (last block may be padded)
			if len(decoded) > size {
				decoded = decoded[:size]
			}

			if !bytes.Equal(original, decoded) {
				t.Fatal("decoded data does not match original")
			}
		})
	}
}

func TestLTCodesWithFrameLoss(t *testing.T) {
	// Simulate 30% frame loss
	original := make([]byte, 10000)
	if _, err := rand.Read(original); err != nil {
		t.Fatal(err)
	}

	blockSize := 200
	enc := NewLTEncoder(original, blockSize)
	dec := NewLTDecoder(enc.NumSourceBlocks(), blockSize)

	maxBlocks := enc.NumSourceBlocks() * 10
	received := 0
	for i := 0; i < maxBlocks && !dec.IsComplete(); i++ {
		index, seed, data := enc.NextBlock()

		// Simulate 30% loss
		if i%10 < 3 {
			continue
		}
		received++
		dec.AddBlock(index, seed, data)
	}

	if !dec.IsComplete() {
		t.Fatalf("decoding not complete with 30%% loss after %d blocks (received %d, source: %d)",
			maxBlocks, received, enc.NumSourceBlocks())
	}

	decoded, err := dec.Decode()
	if err != nil {
		t.Fatal(err)
	}

	if len(decoded) > len(original) {
		decoded = decoded[:len(original)]
	}

	if !bytes.Equal(original, decoded) {
		t.Fatal("decoded data does not match original after frame loss")
	}

	t.Logf("decoded %d bytes with %d blocks received (source blocks: %d, overhead: %.1fx)",
		len(original), received, enc.NumSourceBlocks(),
		float64(received)/float64(enc.NumSourceBlocks()))
}

func TestLTCodesStress(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping stress test")
	}

	// Run 100 times with random data
	for i := 0; i < 100; i++ {
		size := 1000 + i*500
		original := make([]byte, size)
		if _, err := rand.Read(original); err != nil {
			t.Fatal(err)
		}

		blockSize := 200
		enc := NewLTEncoder(original, blockSize)
		dec := NewLTDecoder(enc.NumSourceBlocks(), blockSize)

		maxBlocks := enc.NumSourceBlocks() * 5
		for j := 0; j < maxBlocks && !dec.IsComplete(); j++ {
			index, seed, data := enc.NextBlock()
			dec.AddBlock(index, seed, data)
		}

		if !dec.IsComplete() {
			t.Fatalf("iteration %d: decoding not complete", i)
		}

		decoded, err := dec.Decode()
		if err != nil {
			t.Fatalf("iteration %d: %v", i, err)
		}

		if len(decoded) > size {
			decoded = decoded[:size]
		}
		if !bytes.Equal(original, decoded) {
			t.Fatalf("iteration %d: mismatch", i)
		}
	}
}
