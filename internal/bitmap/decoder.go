package bitmap

import (
	"encoding/binary"
	"fmt"
	"hash/crc32"
	"image"
	"sync/atomic"
)

// Decoder reads 720x720 RGBA frames and extracts encoded payloads.
type Decoder struct {
	config  Config
	lastSeq uint16 // last successfully decoded sequence number

	FramesProcessed atomic.Int64
	FramesDecoded   atomic.Int64
	FramesFailed    atomic.Int64
}

func NewDecoder(config Config) *Decoder {
	return &Decoder{config: config}
}

// DecodeFrame attempts to decode a bitmap frame.
// Returns the sequence number, payload, and any error.
// Returns error if frame is not a valid bitmap frame or CRC fails.
func (d *Decoder) DecodeFrame(frame *image.RGBA) (uint16, []byte, error) {
	d.FramesProcessed.Add(1)

	bounds := frame.Bounds()
	if bounds.Dx() < FrameWidth || bounds.Dy() < FrameHeight {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("frame too small: %dx%d", bounds.Dx(), bounds.Dy())
	}

	bs := d.config.BlockSize
	grid := d.config.GridSize()

	// Verify border checkerboard to confirm this is a bitmap frame
	if !d.verifyBorder(frame, grid, bs) {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("not a bitmap frame (border check failed)")
	}

	// Read all inner blocks
	inner := d.config.InnerGridSize()
	blockValues := make([]uint8, inner*inner)

	for by := 0; by < inner; by++ {
		for bx := 0; bx < inner; bx++ {
			lum := d.sampleBlock(frame, bx+1, by+1, bs) // +1 for border
			blockValues[by*inner+bx] = d.luminanceToValue(lum)
		}
	}

	// Convert block values to bytes
	frameData := d.blocksToBytes(blockValues)

	// Parse header
	if len(frameData) < HeaderSize {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("frame data too short for header")
	}

	magic := frameData[0]
	version := frameData[1]
	if magic != Magic || version != Version {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("bad magic/version: %02x/%02x", magic, version)
	}

	seqNum := binary.BigEndian.Uint16(frameData[2:4])
	payloadLen := binary.BigEndian.Uint16(frameData[4:6])
	storedCRC := binary.BigEndian.Uint32(frameData[6:10])

	if int(payloadLen) > len(frameData)-HeaderSize {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("payload length %d exceeds available %d", payloadLen, len(frameData)-HeaderSize)
	}

	payload := frameData[HeaderSize : HeaderSize+int(payloadLen)]

	// Verify CRC32
	computedCRC := crc32.ChecksumIEEE(payload)
	if storedCRC != computedCRC {
		d.FramesFailed.Add(1)
		return 0, nil, fmt.Errorf("CRC mismatch: stored=%08x computed=%08x", storedCRC, computedCRC)
	}

	// Deduplicate: skip if same seq as last frame (video shows same frame multiple times)
	if seqNum == d.lastSeq && d.FramesDecoded.Load() > 0 {
		return seqNum, nil, fmt.Errorf("duplicate seq %d", seqNum)
	}
	d.lastSeq = seqNum

	d.FramesDecoded.Add(1)
	return seqNum, payload, nil
}

// verifyBorder checks if the outer ring of blocks has a checkerboard pattern.
// Returns true if enough border blocks match the expected pattern.
func (d *Decoder) verifyBorder(frame *image.RGBA, grid, bs int) bool {
	matches := 0
	total := 0

	// Sample a subset of border blocks for speed
	for _, pos := range [][2]int{
		{0, 0}, {grid / 2, 0}, {grid - 1, 0},              // top
		{0, grid / 2}, {grid - 1, grid / 2},                // middle sides
		{0, grid - 1}, {grid / 2, grid - 1}, {grid - 1, grid - 1}, // bottom
	} {
		bx, by := pos[0], pos[1]
		lum := d.sampleBlock(frame, bx, by, bs)

		// Border blocks should be either very dark (<70) or very light (>212)
		if lum < 70 || lum > 212 {
			matches++
		}
		total++
	}

	// At least 6 out of 8 border samples should be extreme values
	return matches >= 6
}

// sampleBlock reads the center region of a block and returns average luminance.
func (d *Decoder) sampleBlock(frame *image.RGBA, bx, by, bs int) uint8 {
	px := bx * bs
	py := by * bs

	// Sample center 3/4 of the block for maximum noise averaging
	margin := bs / 8
	if margin < 1 {
		margin = 1
	}
	startX := px + margin
	startY := py + margin
	sampleSize := bs - 2*margin
	if sampleSize < 4 {
		sampleSize = 4
	}

	var sum int64
	count := 0
	for y := startY; y < startY+sampleSize && y < FrameHeight; y++ {
		for x := startX; x < startX+sampleSize && x < FrameWidth; x++ {
			r, g, b, _ := frame.At(x, y).RGBA()
			// Luminance from RGB (fast approximation)
			lum := (r*299 + g*587 + b*114) / 1000
			sum += int64(lum >> 8) // RGBA returns 0-65535, we want 0-255
			count++
		}
	}

	if count == 0 {
		return 128
	}
	return uint8(sum / int64(count))
}

// luminanceToValue quantizes a luminance byte to a block value.
func (d *Decoder) luminanceToValue(lum uint8) uint8 {
	if d.config.BitsPerBlock == 2 {
		if lum < Thresholds2[0] {
			return 0
		}
		if lum < Thresholds2[1] {
			return 1
		}
		if lum < Thresholds2[2] {
			return 2
		}
		return 3
	}
	// 1 bit
	if lum < Thresholds1[0] {
		return 0
	}
	return 1
}

// blocksToBytes converts block values back to bytes.
func (d *Decoder) blocksToBytes(blocks []uint8) []byte {
	if d.config.BitsPerBlock == 2 {
		numBytes := len(blocks) / 4
		data := make([]byte, numBytes)
		for i := 0; i < numBytes; i++ {
			b := blocks[i*4]<<6 | blocks[i*4+1]<<4 | blocks[i*4+2]<<2 | blocks[i*4+3]
			data[i] = b
		}
		return data
	}
	// 1 bit
	numBytes := len(blocks) / 8
	data := make([]byte, numBytes)
	for i := 0; i < numBytes; i++ {
		var b byte
		for bit := 0; bit < 8; bit++ {
			b = (b << 1) | (blocks[i*8+bit] & 0x01)
		}
		data[i] = b
	}
	return data
}
