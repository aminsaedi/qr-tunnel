package bitmap

import (
	"encoding/binary"
	"hash/crc32"
	"image"
	"image/color"
)

// Encoder creates 720x720 RGBA frames from binary payloads.
type Encoder struct {
	config Config
}

func NewEncoder(config Config) *Encoder {
	return &Encoder{config: config}
}

// EncodePacket encodes a payload into a 720x720 RGBA bitmap frame.
// Returns nil if payload exceeds MaxPayloadBytes.
func (e *Encoder) EncodePacket(seqNum uint16, payload []byte) *image.RGBA {
	if len(payload) > e.config.MaxPayloadBytes() {
		return nil
	}

	// Build header
	header := make([]byte, HeaderSize)
	header[0] = Magic
	header[1] = Version
	binary.BigEndian.PutUint16(header[2:4], seqNum)
	binary.BigEndian.PutUint16(header[4:6], uint16(len(payload)))
	checksum := crc32.ChecksumIEEE(payload)
	binary.BigEndian.PutUint32(header[6:10], checksum)

	// Concatenate header + payload → convert to block values
	frameData := append(header, payload...)
	blockValues := e.bytesToBlocks(frameData)

	// Create image
	img := image.NewRGBA(image.Rect(0, 0, FrameWidth, FrameHeight))

	grid := e.config.GridSize()
	bs := e.config.BlockSize

	// Fill background with mid-gray
	midGray := color.RGBA{128, 128, 128, 255}
	for y := 0; y < FrameHeight; y++ {
		for x := 0; x < FrameWidth; x++ {
			img.SetRGBA(x, y, midGray)
		}
	}

	// Draw border checkerboard (outer ring)
	for by := 0; by < grid; by++ {
		for bx := 0; bx < grid; bx++ {
			if by > 0 && by < grid-1 && bx > 0 && bx < grid-1 {
				continue // inner area, skip
			}
			// Static checkerboard — no phase change between frames.
			// VP9 temporal prediction works much better with static borders.
			isLight := ((bx + by) % 2) == 0
			var lum uint8
			if isLight {
				lum = Levels2[3] // 240
			} else {
				lum = Levels2[0] // 32
			}
			e.fillBlock(img, bx, by, bs, lum)
		}
	}

	// Draw data blocks (inner grid)
	idx := 0
	inner := e.config.InnerGridSize()
	for by := 0; by < inner; by++ {
		for bx := 0; bx < inner; bx++ {
			var lum uint8
			if idx < len(blockValues) {
				lum = e.valueToLuminance(blockValues[idx])
			} else {
				lum = 128 // padding: mid-gray (distinct from all data levels)
			}
			e.fillBlock(img, bx+1, by+1, bs, lum) // +1 for border offset
			idx++
		}
	}

	return img
}

// MaxPayload returns the maximum payload size.
func (e *Encoder) MaxPayload() int {
	return e.config.MaxPayloadBytes()
}

// bytesToBlocks converts a byte slice to block values (2 bits per block).
func (e *Encoder) bytesToBlocks(data []byte) []uint8 {
	if e.config.BitsPerBlock == 2 {
		blocks := make([]uint8, 0, len(data)*4)
		for _, b := range data {
			blocks = append(blocks,
				(b>>6)&0x03,
				(b>>4)&0x03,
				(b>>2)&0x03,
				b&0x03,
			)
		}
		return blocks
	}
	// 1 bit per block
	blocks := make([]uint8, 0, len(data)*8)
	for _, b := range data {
		for bit := 7; bit >= 0; bit-- {
			blocks = append(blocks, (b>>uint(bit))&0x01)
		}
	}
	return blocks
}

// valueToLuminance maps a block value to a luminance byte.
func (e *Encoder) valueToLuminance(val uint8) uint8 {
	if e.config.BitsPerBlock == 2 {
		if val > 3 {
			val = 3
		}
		return Levels2[val]
	}
	// 1 bit
	if val > 1 {
		val = 1
	}
	return Levels1[val]
}

// fillBlock fills a block at grid position (bx, by) with a grayscale value.
func (e *Encoder) fillBlock(img *image.RGBA, bx, by, blockSize int, lum uint8) {
	px := bx * blockSize
	py := by * blockSize
	c := color.RGBA{lum, lum, lum, 255}
	for y := py; y < py+blockSize && y < FrameHeight; y++ {
		for x := px; x < px+blockSize && x < FrameWidth; x++ {
			img.SetRGBA(x, y, c)
		}
	}
}
