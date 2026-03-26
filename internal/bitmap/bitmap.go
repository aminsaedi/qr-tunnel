package bitmap

const (
	FrameWidth  = 720
	FrameHeight = 720

	DefaultBlockSize  = 16
	FallbackBlockSize = 24

	DefaultBitsPerBlock = 2

	Magic   byte = 0xBF
	Version byte = 0x01

	// Header: [1B magic][1B version][2B seq][2B payloadLen][4B crc32] = 10 bytes
	HeaderSize = 10
)

// Luminance levels for 2-bit encoding (4 levels).
// Avoids pure 0 and 255 to reduce codec ringing artifacts.
var Levels2 = [4]uint8{32, 108, 184, 240}

// Thresholds for decoding 2-bit (midpoints between levels).
var Thresholds2 = [3]uint8{70, 146, 212}

// Luminance levels for 1-bit encoding (2 levels).
var Levels1 = [2]uint8{40, 220}
var Thresholds1 = [1]uint8{130}

// Config controls the bitmap encoder/decoder parameters.
type Config struct {
	BlockSize    int // 16 or 24 pixels per block
	BitsPerBlock int // 1 or 2 bits per block
}

func DefaultConfig() Config {
	return Config{
		BlockSize:    DefaultBlockSize,
		BitsPerBlock: DefaultBitsPerBlock,
	}
}

// GridSize returns the number of blocks per row/column.
func (c Config) GridSize() int {
	return FrameWidth / c.BlockSize
}

// InnerGridSize returns the data grid size (excluding border ring).
func (c Config) InnerGridSize() int {
	return c.GridSize() - 2
}

// DataBlocks returns the number of blocks available for data (inner grid minus header).
func (c Config) DataBlocks() int {
	headerBlocks := (HeaderSize * 8) / c.BitsPerBlock
	if (HeaderSize*8)%c.BitsPerBlock != 0 {
		headerBlocks++
	}
	return c.InnerGridSize()*c.InnerGridSize() - headerBlocks
}

// HeaderBlocks returns number of blocks used by the header.
func (c Config) HeaderBlocks() int {
	hb := (HeaderSize * 8) / c.BitsPerBlock
	if (HeaderSize*8)%c.BitsPerBlock != 0 {
		hb++
	}
	return hb
}

// MaxPayloadBytes returns the maximum payload bytes per frame.
func (c Config) MaxPayloadBytes() int {
	totalBits := c.DataBlocks() * c.BitsPerBlock
	return totalBits / 8
}
