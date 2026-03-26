package bitmap

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

// TestFullPipelineSurvival simulates the complete bridge pipeline:
// Go JPEG(75) → VP9 encode → VP9 decode → JPEG(70) capture
// This matches the real Bale path.
func TestFullPipelineSurvival(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not installed")
	}

	tmpDir := t.TempDir()

	tests := []struct {
		block   int
		bits    int
		size    int
		bitrate string
	}{
		{16, 2, 100, "500k"},
		{16, 2, 200, "500k"},
		{16, 2, 400, "500k"},
		{16, 2, 452, "500k"},
		{16, 2, 200, "200k"},
		{16, 2, 200, "100k"},
	}

	for _, tt := range tests {
		name := fmt.Sprintf("b%d_%dbit_%dB_%s", tt.block, tt.bits, tt.size, tt.bitrate)
		t.Run(name, func(t *testing.T) {
			cfg := Config{BlockSize: tt.block, BitsPerBlock: tt.bits}
			enc := NewEncoder(cfg)
			if tt.size > cfg.MaxPayloadBytes() {
				t.Skip("too large")
			}

			pass, fail := 0, 0
			for trial := 0; trial < 10; trial++ {
				payload := make([]byte, tt.size)
				rand.Read(payload)

				img := enc.EncodePacket(uint16(trial+1), payload)

				// Step 1: JPEG compression (Go → bridge)
				jpeg1 := jpegRoundTrip(img, 75)

				// Step 2: Save as PNG for ffmpeg input
				inPath := filepath.Join(tmpDir, fmt.Sprintf("in_%s_%d.png", name, trial))
				outPath := filepath.Join(tmpDir, fmt.Sprintf("out_%s_%d.png", name, trial))
				vpxPath := filepath.Join(tmpDir, fmt.Sprintf("vpx_%s_%d.webm", name, trial))
				savePNGFromRGBA(jpeg1, inPath)

				// Step 3: VP9 encode/decode
				cmd := exec.Command("ffmpeg", "-y",
					"-loop", "1", "-i", inPath, "-t", "0.1",
					"-c:v", "libvpx-vp9", "-b:v", tt.bitrate,
					"-quality", "realtime", "-cpu-used", "8",
					"-pix_fmt", "yuv420p", "-f", "webm", vpxPath)
				if out, err := cmd.CombinedOutput(); err != nil {
					t.Fatalf("VP9 encode: %v\n%s", err, out)
				}

				cmd2 := exec.Command("ffmpeg", "-y",
					"-i", vpxPath, "-frames:v", "1", "-f", "image2", outPath)
				if out, err := cmd2.CombinedOutput(); err != nil {
					t.Fatalf("VP9 decode: %v\n%s", err, out)
				}

				vpxDecoded, err := loadPNGToRGBA(outPath)
				if err != nil {
					t.Fatal(err)
				}

				// Step 4: JPEG compression again (bridge capture)
				jpeg2 := jpegRoundTrip(vpxDecoded, 70)

				// Step 5: Decode bitmap
				dec := NewDecoder(cfg)
				_, result, err := dec.DecodeFrame(jpeg2)
				if err != nil {
					fail++
					if fail <= 2 {
						t.Logf("  FAIL trial=%d: %v", trial, err)
					}
					continue
				}
				if !bytes.Equal(payload, result) {
					fail++
					if fail <= 2 {
						for i := range payload {
							if i < len(result) && payload[i] != result[i] {
								t.Logf("  CORRUPT trial=%d byte=%d: want=%02x got=%02x", trial, i, payload[i], result[i])
								break
							}
						}
					}
					continue
				}
				pass++
			}
			rate := float64(pass) / float64(pass+fail) * 100
			t.Logf("%s: %d/%d passed (%.0f%%)", name, pass, pass+fail, rate)
			if rate < 80 {
				t.Errorf("Pipeline survival rate too low: %.0f%%", rate)
			}
		})
	}
}

func savePNGFromRGBA(img *image.RGBA, path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return png.Encode(f, img)
}

func loadPNGToRGBA(path string) (*image.RGBA, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	decoded, err := png.Decode(f)
	if err != nil {
		return nil, err
	}
	bounds := decoded.Bounds()
	rgba := image.NewRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := decoded.At(x, y).RGBA()
			rgba.SetRGBA(x, y, color.RGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), uint8(a >> 8)})
		}
	}
	return rgba, nil
}
