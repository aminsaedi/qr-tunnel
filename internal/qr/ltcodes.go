package qr

import (
	"fmt"
	"math"
	"math/rand"
)

// LTEncoder produces an infinite stream of LT-coded (Luby Transform) blocks.
type LTEncoder struct {
	sourceBlocks [][]byte
	blockSize    int
	rng          *rand.Rand
	nextIndex    uint32
}

// NewLTEncoder creates an encoder that splits data into blocks of blockSize.
func NewLTEncoder(data []byte, blockSize int) *LTEncoder {
	// Split data into source blocks
	var blocks [][]byte
	for i := 0; i < len(data); i += blockSize {
		end := i + blockSize
		if end > len(data) {
			end = len(data)
		}
		block := make([]byte, blockSize)
		copy(block, data[i:end])
		blocks = append(blocks, block)
	}
	if len(blocks) == 0 {
		blocks = append(blocks, make([]byte, blockSize))
	}

	return &LTEncoder{
		sourceBlocks: blocks,
		blockSize:    blockSize,
		rng:          rand.New(rand.NewSource(42)),
	}
}

// NumSourceBlocks returns the number of source blocks.
func (e *LTEncoder) NumSourceBlocks() int {
	return len(e.sourceBlocks)
}

// NextBlock produces the next LT-coded block.
// Returns: block index, RNG seed used, XOR'd data.
func (e *LTEncoder) NextBlock() (index uint32, seed uint32, data []byte) {
	index = e.nextIndex
	e.nextIndex++

	seed = e.rng.Uint32()
	blockRng := rand.New(rand.NewSource(int64(seed)))

	k := len(e.sourceBlocks)
	degree := robustSolitonDegree(k, blockRng)

	// Pick 'degree' random source blocks and XOR them
	data = make([]byte, e.blockSize)
	chosen := sampleWithoutReplacement(k, degree, blockRng)
	for _, idx := range chosen {
		xorBytes(data, e.sourceBlocks[idx])
	}

	return
}

// LTDecoder reconstructs original data from received LT-coded blocks.
type LTDecoder struct {
	numSourceBlocks int
	blockSize       int
	decoded         [][]byte  // decoded source blocks (nil if not yet decoded)
	numDecoded      int       // count of decoded blocks
	pending         []*ltBlock // blocks waiting to be resolved
}

type ltBlock struct {
	seed    uint32
	data    []byte
	indices []int // source block indices this block covers
}

// NewLTDecoder creates a decoder for the given parameters.
func NewLTDecoder(numSourceBlocks, blockSize int) *LTDecoder {
	return &LTDecoder{
		numSourceBlocks: numSourceBlocks,
		blockSize:       blockSize,
		decoded:         make([][]byte, numSourceBlocks),
	}
}

// AddBlock adds a received LT-coded block to the decoder.
func (d *LTDecoder) AddBlock(index, seed uint32, data []byte) {
	if d.IsComplete() {
		return
	}

	// Determine which source blocks this encoded block covers
	blockRng := rand.New(rand.NewSource(int64(seed)))
	degree := robustSolitonDegree(d.numSourceBlocks, blockRng)
	indices := sampleWithoutReplacement(d.numSourceBlocks, degree, blockRng)

	// Make a copy of the data
	dataCopy := make([]byte, len(data))
	copy(dataCopy, data)

	// XOR out any already-decoded source blocks
	remaining := make([]int, 0, len(indices))
	for _, idx := range indices {
		if d.decoded[idx] != nil {
			xorBytes(dataCopy, d.decoded[idx])
		} else {
			remaining = append(remaining, idx)
		}
	}

	if len(remaining) == 0 {
		// All source blocks already decoded; this block is redundant
		return
	}

	if len(remaining) == 1 {
		// This block decodes exactly one source block
		d.resolveBlock(remaining[0], dataCopy)
		return
	}

	// Store for later resolution
	d.pending = append(d.pending, &ltBlock{
		seed:    seed,
		data:    dataCopy,
		indices: remaining,
	})
}

// resolveBlock marks a source block as decoded and propagates to pending blocks (peeling).
func (d *LTDecoder) resolveBlock(idx int, data []byte) {
	if d.decoded[idx] != nil {
		return // already decoded
	}

	d.decoded[idx] = make([]byte, len(data))
	copy(d.decoded[idx], data)
	d.numDecoded++

	// Propagate: XOR this block out of all pending blocks
	changed := true
	for changed {
		changed = false
		newPending := make([]*ltBlock, 0, len(d.pending))
		for _, blk := range d.pending {
			// Remove resolved index
			remaining := make([]int, 0, len(blk.indices))
			wasRemoved := false
			for _, i := range blk.indices {
				if d.decoded[i] != nil {
					if !wasRemoved || d.decoded[i] != nil {
						xorBytes(blk.data, d.decoded[i])
					}
				} else {
					remaining = append(remaining, i)
				}
			}
			blk.indices = remaining

			if len(remaining) == 0 {
				// Fully resolved (redundant)
				changed = true
				continue
			}
			if len(remaining) == 1 {
				// Can decode one more source block
				d.decoded[remaining[0]] = make([]byte, len(blk.data))
				copy(d.decoded[remaining[0]], blk.data)
				d.numDecoded++
				changed = true
				continue
			}
			newPending = append(newPending, blk)
		}
		d.pending = newPending
	}
}

// IsComplete returns true when all source blocks have been decoded.
func (d *LTDecoder) IsComplete() bool {
	return d.numDecoded >= d.numSourceBlocks
}

// Progress returns the fraction of source blocks decoded.
func (d *LTDecoder) Progress() float64 {
	return float64(d.numDecoded) / float64(d.numSourceBlocks)
}

// Decode returns the reassembled data. Returns error if not complete.
func (d *LTDecoder) Decode() ([]byte, error) {
	if !d.IsComplete() {
		return nil, fmt.Errorf("decoding incomplete: %d/%d blocks", d.numDecoded, d.numSourceBlocks)
	}
	var result []byte
	for _, block := range d.decoded {
		result = append(result, block...)
	}
	return result, nil
}

// robustSolitonDegree samples a degree from the robust soliton distribution.
func robustSolitonDegree(k int, rng *rand.Rand) int {
	if k <= 0 {
		return 1
	}
	if k == 1 {
		return 1
	}

	// Robust soliton parameters
	c := 0.1
	delta := 0.5
	kf := float64(k)

	// Compute S = c * ln(k/delta) * sqrt(k)
	S := c * math.Log(kf/delta) * math.Sqrt(kf)
	if S < 1 {
		S = 1
	}

	// Build CDF of robust soliton distribution
	// Ideal soliton: rho(1) = 1/k, rho(d) = 1/(d*(d-1)) for d=2..k
	// Tau addition for robustness
	cdf := make([]float64, k+1)
	total := 0.0

	for d := 1; d <= k; d++ {
		var rho float64
		if d == 1 {
			rho = 1.0 / kf
		} else {
			rho = 1.0 / (float64(d) * float64(d-1))
		}

		var tau float64
		kOverS := kf / S
		if kOverS < 1 {
			kOverS = 1
		}
		threshold := int(math.Round(kOverS))
		if threshold < 1 {
			threshold = 1
		}

		if d < threshold {
			tau = S / (float64(d) * kf)
		} else if d == threshold {
			tau = S * math.Log(S/delta) / kf
		} else {
			tau = 0
		}

		total += rho + tau
		cdf[d] = total
	}

	// Normalize CDF
	for d := 1; d <= k; d++ {
		cdf[d] /= total
	}

	// Sample from CDF
	u := rng.Float64()
	for d := 1; d <= k; d++ {
		if u <= cdf[d] {
			return d
		}
	}
	return k
}

// sampleWithoutReplacement picks n unique indices from [0, k).
func sampleWithoutReplacement(k, n int, rng *rand.Rand) []int {
	if n > k {
		n = k
	}
	if n == k {
		indices := make([]int, k)
		for i := range indices {
			indices[i] = i
		}
		return indices
	}

	// Fisher-Yates partial shuffle
	indices := make([]int, k)
	for i := range indices {
		indices[i] = i
	}
	for i := 0; i < n; i++ {
		j := i + rng.Intn(k-i)
		indices[i], indices[j] = indices[j], indices[i]
	}
	return indices[:n]
}

// xorBytes XORs src into dst in-place.
func xorBytes(dst, src []byte) {
	n := len(dst)
	if len(src) < n {
		n = len(src)
	}
	for i := 0; i < n; i++ {
		dst[i] ^= src[i]
	}
}
