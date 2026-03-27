package transport

import (
	"log"
	"sync/atomic"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/bitmap"
)

// AdaptiveController dynamically adjusts the send tick interval to maximize
// effective throughput through VP9 video codecs. VP9 encodes static frames
// better over time, so holding a bitmap longer improves decode rate but
// reduces frames per second. The controller hill-climbs to find the optimum.
type AdaptiveController struct {
	decoder *bitmap.Decoder

	// Controlled variable (nanoseconds for atomic access)
	tickNanos atomic.Int64
	direction int // +1 = slowing down, -1 = speeding up

	bestThroughput float64

	// Measurement window
	lastProcessed int64
	lastDecoded   int64
	lastSent      int64
	lastEvalTime  time.Time

	// Config
	payloadBytes int
	evalPeriod   time.Duration
	step         time.Duration
	minTick      time.Duration
	maxTick      time.Duration
	hysteresis   float64

	// Sent frame counter (incremented by sendData)
	FramesSent atomic.Int64

	// Observable metrics
	DecodeRate    atomic.Int64 // decode rate × 1000 (permille)
	EffThroughput atomic.Int64 // bytes/sec
}

func newAdaptiveController(decoder *bitmap.Decoder, payloadBytes int, initialTick time.Duration) *AdaptiveController {
	ac := &AdaptiveController{
		decoder:      decoder,
		direction:    -1, // start by trying to speed up
		payloadBytes: payloadBytes,
		evalPeriod:   5 * time.Second,
		step:         25 * time.Millisecond,
		minTick:      75 * time.Millisecond,
		maxTick:      500 * time.Millisecond,
		hysteresis:   0.95,
		lastEvalTime: time.Now(),
	}
	ac.tickNanos.Store(int64(initialTick))
	ac.lastProcessed = decoder.FramesProcessed.Load()
	ac.lastDecoded = decoder.FramesDecoded.Load()
	ac.lastSent = 0
	return ac
}

// TickInterval returns the current send interval.
func (ac *AdaptiveController) TickInterval() time.Duration {
	return time.Duration(ac.tickNanos.Load())
}

// Evaluate is called periodically to adjust the tick interval.
func (ac *AdaptiveController) Evaluate() {
	now := time.Now()
	elapsed := now.Sub(ac.lastEvalTime)
	if elapsed < ac.evalPeriod {
		return
	}

	processed := ac.decoder.FramesProcessed.Load()
	decoded := ac.decoder.FramesDecoded.Load()
	sent := ac.FramesSent.Load()

	deltaProcessed := processed - ac.lastProcessed
	deltaDecoded := decoded - ac.lastDecoded
	deltaSent := sent - ac.lastSent

	ac.lastProcessed = processed
	ac.lastDecoded = decoded
	ac.lastSent = sent
	ac.lastEvalTime = now

	// Need enough data for a meaningful measurement
	if deltaProcessed < 3 && deltaSent < 2 {
		return
	}

	// Compute windowed decode rate
	var decodeRate float64
	if deltaProcessed > 0 {
		decodeRate = float64(deltaDecoded) / float64(deltaProcessed)
	}

	// Compute effective throughput using actual sent frames and decode rate
	currentTick := time.Duration(ac.tickNanos.Load())
	sendFPS := 1.0 / currentTick.Seconds()
	effThroughput := float64(ac.payloadBytes) * sendFPS * decodeRate

	// Store observables
	ac.DecodeRate.Store(int64(decodeRate * 1000))
	ac.EffThroughput.Store(int64(effThroughput))

	// Hill-climb decision
	if effThroughput > ac.bestThroughput*ac.hysteresis {
		if effThroughput > ac.bestThroughput {
			ac.bestThroughput = effThroughput
		}
		// Current direction is working, continue
	} else {
		// Reverse direction
		ac.direction = -ac.direction
		// Decay best to adapt to changing conditions
		ac.bestThroughput *= 0.85
	}

	// Apply step
	newTick := currentTick + time.Duration(ac.direction)*ac.step
	if newTick < ac.minTick {
		newTick = ac.minTick
		ac.direction = 1
	}
	if newTick > ac.maxTick {
		newTick = ac.maxTick
		ac.direction = -1
	}
	ac.tickNanos.Store(int64(newTick))

	dir := "▲faster"
	if ac.direction > 0 {
		dir = "▼slower"
	}
	log.Printf("[adaptive] tick=%dms decode=%.0f%% eff=%.0f B/s sent=%d decoded=%d %s",
		newTick.Milliseconds(), decodeRate*100, effThroughput, deltaSent, deltaDecoded, dir)
}
