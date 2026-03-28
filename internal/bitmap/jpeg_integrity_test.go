package bitmap

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"testing"
)

// TestJPEGDoubleCompression simulates the bridge pipeline:
// Go encode → JPEG(75) → JPEG decode → JPEG(70) → JPEG decode → bitmap decode
// This is what actually happens: Go sends JPEG to bridge, bridge captures video
// as JPEG. Even without VP9, double JPEG compression can shift pixel values.
func TestJPEGDoubleCompression(t *testing.T) {
	for _, cfg := range []Config{
		{BlockSize: 16, BitsPerBlock: 2},
		{BlockSize: 16, BitsPerBlock: 1},
		{BlockSize: 24, BitsPerBlock: 2},
	} {
		t.Run(fmt.Sprintf("block%d_%dbit", cfg.BlockSize, cfg.BitsPerBlock), func(t *testing.T) {
			enc := NewEncoder(cfg)
			maxP := cfg.MaxPayloadBytes()

			sizes := []int{50, 100, maxP}
			for _, size := range sizes {
				if size > maxP {
					continue
				}

				pass, fail := 0, 0
				for trial := 0; trial < 30; trial++ {
					payload := make([]byte, size)
					rand.Read(payload) //nolint:errcheck

					img := enc.EncodePacket(uint16(trial+1), payload)

					// Double JPEG compression
					compressed := jpegRoundTrip(img, 75)
					compressed2 := jpegRoundTrip(compressed, 70)

					dec := NewDecoder(cfg)
					_, result, err := dec.DecodeFrame(compressed2)
					if err != nil {
						fail++
						if fail <= 3 {
							t.Logf("  FAIL size=%d trial=%d: %v", size, trial, err)
						}
						continue
					}
					if !bytes.Equal(payload, result) {
						fail++
						if fail <= 3 {
							for i := range payload {
								if i < len(result) && payload[i] != result[i] {
									t.Logf("  CORRUPT size=%d trial=%d byte=%d: want=%02x got=%02x", size, trial, i, payload[i], result[i])
									break
								}
							}
						}
						continue
					}
					pass++
				}
				rate := float64(pass) / float64(pass+fail) * 100
				t.Logf("size=%d: %d/%d passed (%.0f%%)", size, pass, pass+fail, rate)
				if rate < 90 {
					t.Errorf("JPEG double compression survival rate too low: %.0f%%", rate)
				}
			}
		})
	}
}

func jpegRoundTrip(img image.Image, quality int) *image.RGBA {
	var buf bytes.Buffer
	_ = jpeg.Encode(&buf, img, &jpeg.Options{Quality: quality})
	decoded, _ := jpeg.Decode(&buf)

	bounds := decoded.Bounds()
	rgba := image.NewRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := decoded.At(x, y).RGBA()
			rgba.SetRGBA(x, y, color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), uint8(a >> 8)})
		}
	}
	return rgba
}
