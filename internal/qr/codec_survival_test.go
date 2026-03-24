package qr

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"image"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

// TestQRSurvivesVP8Codec tests whether QR codes remain decodable after
// being compressed through a VP8 video codec at various bitrates.
// This simulates what happens in a real video call (Google Meet, Zoom, etc).
//
// Pipeline: QR image → PNG → ffmpeg VP8 encode → VP8 decode → PNG → QR decode
func TestQRSurvivesVP8Codec(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not installed, skipping codec survival test")
	}

	// Test matrix: different QR versions × bitrates × data sizes
	tests := []struct {
		name      string
		qrVersion int
		ecc       string
		dataSize  int
		bitrate   string // VP8 target bitrate
	}{
		// Large modules (low version) — should survive better
		{"v10_eccH_100B_500k", 10, "H", 100, "500k"},
		{"v10_eccH_100B_200k", 10, "H", 100, "200k"},
		{"v10_eccH_100B_100k", 10, "H", 100, "100k"},
		{"v10_eccM_100B_500k", 10, "M", 100, "500k"},
		{"v10_eccM_100B_200k", 10, "M", 100, "200k"},

		// Medium modules
		{"v15_eccH_200B_500k", 15, "H", 200, "500k"},
		{"v15_eccH_200B_200k", 15, "H", 200, "200k"},
		{"v15_eccM_300B_500k", 15, "M", 300, "500k"},

		// Current defaults (v25) — likely to struggle
		{"v25_eccM_800B_500k", 25, "M", 800, "500k"},
		{"v25_eccM_800B_1M", 25, "M", 800, "1M"},
		{"v25_eccH_500B_500k", 25, "H", 500, "500k"},
		{"v25_eccH_500B_1M", 25, "H", 500, "1M"},

		// High bitrate (good connection)
		{"v15_eccH_200B_2M", 15, "H", 200, "2M"},
		{"v20_eccH_400B_2M", 20, "H", 400, "2M"},
		{"v25_eccM_800B_2M", 25, "M", 800, "2M"},
	}

	tmpDir := t.TempDir()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Generate random payload
			payload := make([]byte, tt.dataSize)
			if _, err := rand.Read(payload); err != nil {
				t.Fatal(err)
			}

			// Create QR frame
			config := EncoderConfig{
				Version:         tt.qrVersion,
				ErrorCorrection: tt.ecc,
				ChunkSize:       tt.dataSize,
				FPS:             15,
				FrameWidth:      720,
				FrameHeight:     720,
			}
			enc := NewEncoder(config)

			// EncodeFrame internally does base64, so pass raw payload
			frame, err := enc.EncodeFrame(payload)
			if err != nil {
				t.Skipf("QR version %d can't fit %d bytes: %v", tt.qrVersion, tt.dataSize, err)
				return
			}

			// Save as PNG
			inputPath := filepath.Join(tmpDir, fmt.Sprintf("input_%s.png", tt.name))
			outputPath := filepath.Join(tmpDir, fmt.Sprintf("output_%s.png", tt.name))
			if err := savePNG(frame, inputPath); err != nil {
				t.Fatal(err)
			}

			// Run through VP8 codec via ffmpeg:
			// PNG → VP8 encode (1 frame video) → VP8 decode → PNG
			cmd := exec.Command("ffmpeg",
				"-y",                    // overwrite
				"-loop", "1",            // loop input image
				"-i", inputPath,         // input PNG
				"-t", "0.1",             // 0.1 seconds (a few frames)
				"-c:v", "libvpx",        // VP8 codec
				"-b:v", tt.bitrate,      // target bitrate
				"-quality", "realtime",  // simulate real-time encoding
				"-cpu-used", "8",        // fastest encoding (worst quality, like real-time calls)
				"-pix_fmt", "yuv420p",   // standard pixel format
				"-f", "webm",            // WebM container
				"pipe:1",                // pipe to stdout
			)

			// Pipe VP8 output to decoder
			vpxData, err := cmd.Output()
			if err != nil {
				// Try to get stderr for debugging
				if exitErr, ok := err.(*exec.ExitError); ok {
					t.Logf("ffmpeg stderr: %s", string(exitErr.Stderr))
				}
				t.Fatalf("VP8 encode failed: %v", err)
			}

			// Now decode the VP8 back to PNG
			vpxPath := filepath.Join(tmpDir, fmt.Sprintf("vpx_%s.webm", tt.name))
			if err := os.WriteFile(vpxPath, vpxData, 0644); err != nil {
				t.Fatal(err)
			}

			cmd2 := exec.Command("ffmpeg",
				"-y",
				"-i", vpxPath,
				"-frames:v", "1",        // extract first frame
				"-f", "image2",
				outputPath,
			)
			if out, err := cmd2.CombinedOutput(); err != nil {
				t.Fatalf("VP8 decode failed: %v\n%s", err, string(out))
			}

			// Load the decoded frame
			decodedFrame, err := loadPNG(outputPath)
			if err != nil {
				t.Fatalf("load decoded frame: %v", err)
			}

			// Try to decode the QR code
			gray := binarize(decodedFrame)
			qrData, err := decodeQR(gray)

			if err != nil {
				t.Errorf("FAIL: QR unreadable after VP8 @ %s bitrate (v%d, ECC=%s, %dB)",
					tt.bitrate, tt.qrVersion, tt.ecc, tt.dataSize)
				return
			}

			// qrData is base64-encoded (EncodeFrame wraps in base64)
			decoded, err := base64.StdEncoding.DecodeString(string(qrData))
			if err != nil {
				t.Errorf("FAIL: QR decoded but base64 invalid after VP8 @ %s", tt.bitrate)
				return
			}

			if !bytes.Equal(payload, decoded) {
				t.Errorf("FAIL: QR decoded but data corrupted after VP8 @ %s (got %d bytes, want %d)",
					tt.bitrate, len(decoded), len(payload))
				return
			}

			t.Logf("PASS: QR survived VP8 @ %s bitrate (v%d, ECC=%s, %dB payload)",
				tt.bitrate, tt.qrVersion, tt.ecc, tt.dataSize)
		})
	}
}

// TestQRSurvivesH264Codec runs the same test with H.264 (used by some call services).
func TestQRSurvivesH264Codec(t *testing.T) {
	if _, err := exec.LookPath("ffmpeg"); err != nil {
		t.Skip("ffmpeg not installed")
	}

	tests := []struct {
		name    string
		version int
		ecc     string
		size    int
		crf     int // H.264 quality (lower = better, 23 = default, 28 = low, 35 = very low)
	}{
		{"v10_H_100B_crf23", 10, "H", 100, 23},
		{"v10_H_100B_crf28", 10, "H", 100, 28},
		{"v10_H_100B_crf35", 10, "H", 100, 35},
		{"v15_H_200B_crf23", 15, "H", 200, 23},
		{"v15_H_200B_crf28", 15, "H", 200, 28},
		{"v20_H_400B_crf23", 20, "H", 400, 23},
		{"v25_M_800B_crf23", 25, "M", 800, 23},
		{"v25_M_800B_crf28", 25, "M", 800, 28},
	}

	tmpDir := t.TempDir()

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			payload := make([]byte, tt.size)
			if _, err := rand.Read(payload); err != nil {
				t.Fatal(err)
			}

			config := EncoderConfig{
				Version:         tt.version,
				ErrorCorrection: tt.ecc,
				ChunkSize:       tt.size,
				FPS:             15,
				FrameWidth:      720,
				FrameHeight:     720,
			}
			enc := NewEncoder(config)
			frame, err := enc.EncodeFrame(payload)
			if err != nil {
				t.Skipf("QR can't fit data: %v", err)
				return
			}

			inputPath := filepath.Join(tmpDir, fmt.Sprintf("in_%s.png", tt.name))
			outputPath := filepath.Join(tmpDir, fmt.Sprintf("out_%s.png", tt.name))
			h264Path := filepath.Join(tmpDir, fmt.Sprintf("h264_%s.mp4", tt.name))

			if err := savePNG(frame, inputPath); err != nil {
				t.Fatal(err)
			}

			// Encode with H.264
			cmd := exec.Command("ffmpeg", "-y",
				"-loop", "1", "-i", inputPath,
				"-t", "0.1",
				"-c:v", "libx264",
				"-crf", fmt.Sprintf("%d", tt.crf),
				"-preset", "ultrafast", // simulate real-time
				"-pix_fmt", "yuv420p",
				h264Path,
			)
			if out, err := cmd.CombinedOutput(); err != nil {
				t.Fatalf("H.264 encode failed: %v\n%s", err, string(out))
			}

			// Decode back to PNG
			cmd2 := exec.Command("ffmpeg", "-y",
				"-i", h264Path,
				"-frames:v", "1",
				outputPath,
			)
			if out, err := cmd2.CombinedOutput(); err != nil {
				t.Fatalf("H.264 decode failed: %v\n%s", err, string(out))
			}

			decodedFrame, err := loadPNG(outputPath)
			if err != nil {
				t.Fatal(err)
			}

			gray := binarize(decodedFrame)
			qrData, err := decodeQR(gray)

			if err != nil {
				t.Errorf("FAIL: QR unreadable after H.264 CRF %d (v%d, ECC=%s, %dB)",
					tt.crf, tt.version, tt.ecc, tt.size)
				return
			}

			decoded, decErr := base64.StdEncoding.DecodeString(string(qrData))
			if decErr != nil {
				t.Errorf("FAIL: QR decoded but base64 invalid after H.264 CRF %d", tt.crf)
				return
			}
			if !bytes.Equal(payload, decoded) {
				t.Errorf("FAIL: QR decoded but data corrupted after H.264 CRF %d (got %d bytes, want %d)",
					tt.crf, len(decoded), len(payload))
				return
			}

			t.Logf("PASS: QR survived H.264 CRF %d (v%d, ECC=%s, %dB payload)",
				tt.crf, tt.version, tt.ecc, tt.size)
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

	// Convert to RGBA
	bounds := img.Bounds()
	rgba := image.NewRGBA(bounds)
	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			rgba.Set(x, y, img.At(x, y))
		}
	}
	return rgba, nil
}
