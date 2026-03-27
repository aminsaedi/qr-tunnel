package bitmap

import (
	"crypto/rand"
	"fmt"
	"image"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

func TestBitmapSurvivesVP9(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not installed")
	}

	tests := []struct {
		name      string
		blockSize int
		bits      int
		dataSize  int
		bitrate   string
	}{
		// 16x16 blocks, 2 bits — primary target
		{"16x16_2bit_100B_500k", 16, 2, 100, "500k"},
		{"16x16_2bit_200B_500k", 16, 2, 200, "500k"},
		{"16x16_2bit_400B_500k", 16, 2, 400, "500k"},
		{"16x16_2bit_200B_200k", 16, 2, 200, "200k"},
		{"16x16_2bit_200B_1M", 16, 2, 200, "1M"},

		// 24x24 blocks, 2 bits — fallback
		{"24x24_2bit_100B_500k", 24, 2, 100, "500k"},
		{"24x24_2bit_180B_500k", 24, 2, 180, "500k"},
		{"24x24_2bit_100B_200k", 24, 2, 100, "200k"},

		// 16x16, 1 bit — ultra-safe
		{"16x16_1bit_100B_500k", 16, 1, 100, "500k"},
		{"16x16_1bit_200B_500k", 16, 1, 200, "500k"},
		{"16x16_1bit_100B_200k", 16, 1, 100, "200k"},

		// 12x12 blocks, 1 bit — 410 bytes/frame (1.8x improvement)
		{"12x12_1bit_200B_500k", 12, 1, 200, "500k"},
		{"12x12_1bit_400B_500k", 12, 1, 400, "500k"},
		{"12x12_1bit_200B_200k", 12, 1, 200, "200k"},

		// 10x10 blocks, 1 bit — 602 bytes/frame (2.7x improvement)
		{"10x10_1bit_300B_500k", 10, 1, 300, "500k"},
		{"10x10_1bit_600B_500k", 10, 1, 600, "500k"},
		{"10x10_1bit_300B_200k", 10, 1, 300, "200k"},

		// 8x8 blocks, 1 bit — 958 bytes/frame (4.3x improvement)
		{"8x8_1bit_500B_500k", 8, 1, 500, "500k"},
		{"8x8_1bit_900B_500k", 8, 1, 900, "500k"},
		{"8x8_1bit_500B_200k", 8, 1, 500, "200k"},
	}

	tmpDir := t.TempDir()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := Config{BlockSize: tt.blockSize, BitsPerBlock: tt.bits}
			enc := NewEncoder(cfg)
			dec := NewDecoder(cfg)

			maxP := cfg.MaxPayloadBytes()
			if tt.dataSize > maxP {
				t.Skipf("payload %d > max %d", tt.dataSize, maxP)
			}

			payload := make([]byte, tt.dataSize)
			if _, err := rand.Read(payload); err != nil {
				t.Fatal(err)
			}

			img := enc.EncodePacket(1, payload)
			if img == nil {
				t.Fatal("encode returned nil")
			}

			// Save as PNG
			inPath := filepath.Join(tmpDir, fmt.Sprintf("in_%s.png", tt.name))
			outPath := filepath.Join(tmpDir, fmt.Sprintf("out_%s.png", tt.name))
			vpxPath := filepath.Join(tmpDir, fmt.Sprintf("vpx_%s.webm", tt.name))

			if err := savePNG(img, inPath); err != nil {
				t.Fatal(err)
			}

			// VP9 encode → decode via ffmpeg
			cmd := exec.Command("ffmpeg", "-y",
				"-loop", "1", "-i", inPath,
				"-t", "0.1",
				"-c:v", "libvpx-vp9",
				"-b:v", tt.bitrate,
				"-quality", "realtime",
				"-cpu-used", "8",
				"-pix_fmt", "yuv420p",
				"-f", "webm",
				vpxPath,
			)
			if out, err := cmd.CombinedOutput(); err != nil {
				t.Fatalf("VP9 encode: %v\n%s", err, out)
			}

			cmd2 := exec.Command("ffmpeg", "-y",
				"-i", vpxPath,
				"-frames:v", "1",
				"-f", "image2",
				outPath,
			)
			if out, err := cmd2.CombinedOutput(); err != nil {
				t.Fatalf("VP9 decode: %v\n%s", err, out)
			}

			decoded, err := loadPNG(outPath)
			if err != nil {
				t.Fatal(err)
			}

			// Try to decode the bitmap
			dec.lastSeq = 0 // reset
			seq, result, err := dec.DecodeFrame(decoded)
			if err != nil {
				t.Errorf("FAIL: bitmap unreadable after VP9 @ %s (%s): %v", tt.bitrate, tt.name, err)
				return
			}

			if seq != 1 {
				t.Errorf("FAIL: wrong seq %d after VP9", seq)
				return
			}

			if len(result) != len(payload) {
				t.Errorf("FAIL: length %d != %d after VP9", len(result), len(payload))
				return
			}

			for i := range payload {
				if result[i] != payload[i] {
					t.Errorf("FAIL: byte %d mismatch after VP9 @ %s", i, tt.bitrate)
					return
				}
			}

			t.Logf("PASS: %s survived VP9 @ %s (%d bytes)", tt.name, tt.bitrate, tt.dataSize)
		})
	}
}

func TestBitmapSurvivesVP8(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not installed")
	}

	tests := []struct {
		name    string
		block   int
		bits    int
		size    int
		bitrate string
	}{
		{"16x16_2bit_200B_500k", 16, 2, 200, "500k"},
		{"16x16_2bit_200B_200k", 16, 2, 200, "200k"},
		{"24x24_2bit_100B_500k", 24, 2, 100, "500k"},
	}

	tmpDir := t.TempDir()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cfg := Config{BlockSize: tt.block, BitsPerBlock: tt.bits}
			enc := NewEncoder(cfg)
			dec := NewDecoder(cfg)

			if tt.size > cfg.MaxPayloadBytes() {
				t.Skip("payload too large")
			}

			payload := make([]byte, tt.size)
			rand.Read(payload)

			img := enc.EncodePacket(1, payload)
			inPath := filepath.Join(tmpDir, fmt.Sprintf("in_%s.png", tt.name))
			outPath := filepath.Join(tmpDir, fmt.Sprintf("out_%s.png", tt.name))
			vpxPath := filepath.Join(tmpDir, fmt.Sprintf("vpx_%s.webm", tt.name))

			savePNG(img, inPath)

			cmd := exec.Command("ffmpeg", "-y",
				"-loop", "1", "-i", inPath, "-t", "0.1",
				"-c:v", "libvpx", "-b:v", tt.bitrate,
				"-quality", "realtime", "-cpu-used", "8",
				"-pix_fmt", "yuv420p", "-f", "webm", vpxPath,
			)
			if out, err := cmd.CombinedOutput(); err != nil {
				t.Fatalf("VP8 encode: %v\n%s", err, out)
			}

			exec.Command("ffmpeg", "-y", "-i", vpxPath, "-frames:v", "1", "-f", "image2", outPath).Run()

			decoded, err := loadPNG(outPath)
			if err != nil {
				t.Fatal(err)
			}

			dec.lastSeq = 0
			_, result, err := dec.DecodeFrame(decoded)
			if err != nil {
				t.Errorf("FAIL: %s after VP8 @ %s: %v", tt.name, tt.bitrate, err)
				return
			}
			for i := range payload {
				if result[i] != payload[i] {
					t.Errorf("FAIL: byte %d mismatch", i)
					return
				}
			}
			t.Logf("PASS: %s survived VP8 @ %s", tt.name, tt.bitrate)
		})
	}
}

func savePNG(img *image.RGBA, path string) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}
	defer f.Close()
	return png.Encode(f, img)
}

func loadPNG(path string) (*image.RGBA, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	img, err := png.Decode(f)
	if err != nil {
		return nil, err
	}
	bounds := img.Bounds()
	rgba := image.NewRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			rgba.Set(x, y, img.At(x, y))
		}
	}
	return rgba, nil
}
