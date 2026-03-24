package tui

import (
	"fmt"
	"sync/atomic"
	"time"

	tea "github.com/charmbracelet/bubbletea"
)

// MetricsSource provides live metrics to the TUI.
type MetricsSource struct {
	// Connection state
	WebRTCState   atomic.Value // string
	SignalingURL  atomic.Value // string

	// SOCKS5
	SOCKS5Addr    atomic.Value // string
	ActiveConns   atomic.Int32
	TotalConns    atomic.Int64

	// QR encoding/decoding
	QREncodeFPS   atomic.Value // float64
	QRDecodeFPS   atomic.Value // float64
	DecodeOK      atomic.Value // float64 (0-1)

	// Transport
	TXRate        atomic.Value // float64 (KB/s)
	RXRate        atomic.Value // float64 (KB/s)
	ActiveStreams  atomic.Int32
	RTTEstimate   atomic.Value // time.Duration
	WindowUsed    atomic.Int32
	WindowMax     atomic.Int32

	// Per-stream info
	Streams       atomic.Value // []StreamInfo

	// Tunable params
	QRVersion     atomic.Int32
	ECC           atomic.Value // string
	FPS           atomic.Int32
	ChunkSize     atomic.Int32

	// Simulation params
	DropRate      atomic.Int32 // 0-100
	NoisePct      atomic.Int32 // 0-100
	DelayMs       atomic.Int32 // 0-500
}

type StreamInfo struct {
	ID       uint16
	Dest     string
	TXBytes  int64
	RXBytes  int64
	Active   bool
}

func NewMetricsSource() *MetricsSource {
	m := &MetricsSource{}
	m.WebRTCState.Store("disconnected")
	m.SignalingURL.Store("ws://localhost:3000")
	m.SOCKS5Addr.Store(":1080")
	m.QREncodeFPS.Store(float64(0))
	m.QRDecodeFPS.Store(float64(0))
	m.DecodeOK.Store(float64(0))
	m.TXRate.Store(float64(0))
	m.RXRate.Store(float64(0))
	m.RTTEstimate.Store(time.Duration(0))
	m.Streams.Store([]StreamInfo{})
	m.ECC.Store("M")
	m.QRVersion.Store(25)
	m.FPS.Store(15)
	m.ChunkSize.Store(800)
	m.WindowMax.Store(32)
	return m
}

// tickMsg triggers periodic UI updates.
type tickMsg time.Time

func tickCmd() tea.Cmd {
	return tea.Tick(500*time.Millisecond, func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}

// Mode represents the current TUI mode.
type Mode int

const (
	ModeNormal Mode = iota
	ModeParams
)

// Model is the bubbletea model for the TUI.
type Model struct {
	metrics     *MetricsSource
	mode        Mode
	role        string
	version     string
	width       int
	height      int
	paramCursor int // which param is selected in params mode
	quitting    bool
}

func NewModel(metrics *MetricsSource, role, version string) Model {
	return Model{
		metrics: metrics,
		role:    role,
		version: version,
	}
}

func (m Model) Init() tea.Cmd {
	return tickCmd()
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		return m.handleKey(msg)
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		return m, nil
	case tickMsg:
		return m, tickCmd()
	}
	return m, nil
}

func (m Model) handleKey(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	switch msg.String() {
	case "q", "ctrl+c":
		m.quitting = true
		return m, tea.Quit
	case "tab":
		if m.mode == ModeNormal {
			m.mode = ModeParams
		} else {
			m.mode = ModeNormal
		}
		return m, nil
	}

	if m.mode == ModeParams {
		return m.handleParamsKey(msg)
	}

	return m, nil
}

func (m Model) handleParamsKey(msg tea.KeyMsg) (tea.Model, tea.Cmd) {
	numParams := 7 // QR ver, ECC, FPS, Chunk, Drop, Noise, Delay

	switch msg.String() {
	case "up", "k":
		m.paramCursor--
		if m.paramCursor < 0 {
			m.paramCursor = numParams - 1
		}
	case "down", "j":
		m.paramCursor++
		if m.paramCursor >= numParams {
			m.paramCursor = 0
		}
	case "right", "l", "+", "=":
		m.adjustParam(1)
	case "left", "h", "-":
		m.adjustParam(-1)
	}

	return m, nil
}

func (m *Model) adjustParam(delta int) {
	switch m.paramCursor {
	case 0: // QR Version
		v := m.metrics.QRVersion.Load() + int32(delta)
		if v < 1 {
			v = 1
		}
		if v > 40 {
			v = 40
		}
		m.metrics.QRVersion.Store(v)
	case 1: // ECC
		levels := []string{"L", "M", "Q", "H"}
		current := m.metrics.ECC.Load().(string)
		idx := 0
		for i, l := range levels {
			if l == current {
				idx = i
				break
			}
		}
		idx += delta
		if idx < 0 {
			idx = 0
		}
		if idx >= len(levels) {
			idx = len(levels) - 1
		}
		m.metrics.ECC.Store(levels[idx])
	case 2: // FPS
		v := m.metrics.FPS.Load() + int32(delta)
		if v < 1 {
			v = 1
		}
		if v > 30 {
			v = 30
		}
		m.metrics.FPS.Store(v)
	case 3: // Chunk Size
		v := m.metrics.ChunkSize.Load() + int32(delta*100)
		if v < 100 {
			v = 100
		}
		if v > 2000 {
			v = 2000
		}
		m.metrics.ChunkSize.Store(v)
	case 4: // Drop Rate
		v := m.metrics.DropRate.Load() + int32(delta*5)
		if v < 0 {
			v = 0
		}
		if v > 80 {
			v = 80
		}
		m.metrics.DropRate.Store(v)
	case 5: // Noise %
		v := m.metrics.NoisePct.Load() + int32(delta*5)
		if v < 0 {
			v = 0
		}
		if v > 50 {
			v = 50
		}
		m.metrics.NoisePct.Store(v)
	case 6: // Delay
		v := m.metrics.DelayMs.Load() + int32(delta*50)
		if v < 0 {
			v = 0
		}
		if v > 500 {
			v = 500
		}
		m.metrics.DelayMs.Store(v)
	}
}

func stateIndicator(state string) string {
	switch state {
	case "connected":
		return "● Connected"
	case "connecting":
		return "◌ Connecting"
	case "failed":
		return "✗ Failed"
	default:
		return "○ Disconnected"
	}
}

func formatBytes(b int64) string {
	if b < 1024 {
		return fmt.Sprintf("%dB", b)
	}
	if b < 1024*1024 {
		return fmt.Sprintf("%.1fKB", float64(b)/1024)
	}
	return fmt.Sprintf("%.1fMB", float64(b)/(1024*1024))
}

func bar(pct float64, width int) string {
	filled := int(pct * float64(width))
	if filled > width {
		filled = width
	}
	result := make([]byte, width)
	for i := 0; i < width; i++ {
		if i < filled {
			result[i] = '#'
		} else {
			result[i] = '-'
		}
	}
	return string(result)
}
