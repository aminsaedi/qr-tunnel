package tui

import (
	"fmt"
	"strings"
	"time"

	"github.com/charmbracelet/lipgloss"
)

var (
	titleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#00d4ff"))

	boxStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("#333"))

	headerStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#888")).
			MarginBottom(1)

	activeStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#00ff88"))

	warningStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#f39c12"))

	errorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#ff4757"))

	dimStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#555"))

	selectedStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#00d4ff")).
			Bold(true)

	helpStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#555"))
)

func (m Model) View() string {
	if m.quitting {
		return "Shutting down...\n"
	}

	var sb strings.Builder

	// Title bar
	title := titleStyle.Render(fmt.Sprintf("  qr-tunnel %s", m.version))
	modeStr := dimStyle.Render(fmt.Sprintf("[mode: %s]", m.role))
	sb.WriteString(fmt.Sprintf("%s          %s\n\n", title, modeStr))

	// Status + Metrics side by side
	status := m.renderStatus()
	metrics := m.renderMetrics()

	row := lipgloss.JoinHorizontal(lipgloss.Top, status, "  ", metrics)
	sb.WriteString(row)
	sb.WriteString("\n\n")

	// Streams
	sb.WriteString(m.renderStreams())
	sb.WriteString("\n")

	// Params
	sb.WriteString(m.renderParams())
	sb.WriteString("\n")

	// Help
	if m.mode == ModeParams {
		sb.WriteString(helpStyle.Render("  [↑↓] select  [←→] adjust  [Tab] back  [q] quit"))
	} else {
		sb.WriteString(helpStyle.Render("  [q]uit  [Tab] params"))
	}
	sb.WriteString("\n")

	return sb.String()
}

func (m Model) renderStatus() string {
	webrtcState := m.metrics.WebRTCState.Load().(string)
	sigURL := m.metrics.SignalingURL.Load().(string)
	socksAddr := m.metrics.SOCKS5Addr.Load().(string)
	activeConns := m.metrics.ActiveConns.Load()

	var lines []string
	lines = append(lines, headerStyle.Render("STATUS"))

	// WebRTC state
	stateStr := stateIndicator(webrtcState)
	switch webrtcState {
	case "connected":
		lines = append(lines, fmt.Sprintf("  WebRTC: %s", activeStyle.Render(stateStr)))
	case "connecting":
		lines = append(lines, fmt.Sprintf("  WebRTC: %s", warningStyle.Render(stateStr)))
	default:
		lines = append(lines, fmt.Sprintf("  WebRTC: %s", dimStyle.Render(stateStr)))
	}

	// SOCKS5
	if m.role == "client" {
		lines = append(lines, fmt.Sprintf("  SOCKS5: %s", activeStyle.Render("● "+socksAddr)))
		lines = append(lines, fmt.Sprintf("  %d conns", activeConns))
	}

	// Signaling
	lines = append(lines, fmt.Sprintf("  Sig:    %s", dimStyle.Render(sigURL)))

	content := strings.Join(lines, "\n")
	return boxStyle.Width(24).Render(content)
}

func (m Model) renderMetrics() string {
	txRate := m.metrics.TXRate.Load().(float64)
	rxRate := m.metrics.RXRate.Load().(float64)
	encodeFPS := m.metrics.QREncodeFPS.Load().(float64)
	decodeFPS := m.metrics.QRDecodeFPS.Load().(float64)
	decodeOK := m.metrics.DecodeOK.Load().(float64)
	activeStreams := m.metrics.ActiveStreams.Load()
	rtt := m.metrics.RTTEstimate.Load().(time.Duration)
	windowUsed := m.metrics.WindowUsed.Load()
	windowMax := m.metrics.WindowMax.Load()

	var lines []string
	lines = append(lines, headerStyle.Render("METRICS"))

	maxRate := 50.0 // KB/s for bar scaling
	txBar := bar(txRate/maxRate, 8)
	rxBar := bar(rxRate/maxRate, 8)
	lines = append(lines, fmt.Sprintf("  TX: %6.1f KB/s  %s", txRate, txBar))
	lines = append(lines, fmt.Sprintf("  RX: %6.1f KB/s  %s", rxRate, rxBar))
	lines = append(lines, "")
	lines = append(lines, fmt.Sprintf("  QR encode: %5.1f fps", encodeFPS))
	lines = append(lines, fmt.Sprintf("  QR decode: %5.1f fps", decodeFPS))

	decodeStr := fmt.Sprintf("%.1f%%", decodeOK*100)
	if decodeOK > 0.9 {
		lines = append(lines, fmt.Sprintf("  Decode OK: %s", activeStyle.Render(decodeStr)))
	} else if decodeOK > 0.5 {
		lines = append(lines, fmt.Sprintf("  Decode OK: %s", warningStyle.Render(decodeStr)))
	} else {
		lines = append(lines, fmt.Sprintf("  Decode OK: %s", errorStyle.Render(decodeStr)))
	}

	lines = append(lines, "")
	lines = append(lines, fmt.Sprintf("  Streams:   %d", activeStreams))
	lines = append(lines, fmt.Sprintf("  RTT:       %dms", rtt.Milliseconds()))
	lines = append(lines, fmt.Sprintf("  Window:    %d/%d KB", windowUsed, windowMax))

	content := strings.Join(lines, "\n")
	return boxStyle.Width(36).Render(content)
}

func (m Model) renderStreams() string {
	streams := m.metrics.Streams.Load().([]StreamInfo)

	var lines []string
	lines = append(lines, headerStyle.Render("  STREAMS"))

	if len(streams) == 0 {
		lines = append(lines, dimStyle.Render("  (no active streams)"))
	}

	for _, s := range streams {
		status := activeStyle.Render("●")
		if !s.Active {
			status = dimStyle.Render("○")
		}
		lines = append(lines, fmt.Sprintf("  #%-3d %-28s ↑%s  ↓%s  %s",
			s.ID, s.Dest,
			formatBytes(s.TXBytes), formatBytes(s.RXBytes),
			status))
	}

	return strings.Join(lines, "\n")
}

func (m Model) renderParams() string {
	qrVer := m.metrics.QRVersion.Load()
	ecc := m.metrics.ECC.Load().(string)
	fps := m.metrics.FPS.Load()
	chunk := m.metrics.ChunkSize.Load()
	drop := m.metrics.DropRate.Load()
	noise := m.metrics.NoisePct.Load()
	delay := m.metrics.DelayMs.Load()

	params := []struct {
		label string
		value string
		isSim bool
	}{
		{"QR ver", fmt.Sprintf("%d", qrVer), false},
		{"ECC", ecc, false},
		{"FPS", fmt.Sprintf("%d", fps), false},
		{"Chunk", fmt.Sprintf("%dB", chunk), false},
		{"SIM drop", fmt.Sprintf("%d%%", drop), true},
		{"SIM noise", fmt.Sprintf("%d%%", noise), true},
		{"SIM delay", fmt.Sprintf("%dms", delay), true},
	}

	title := "  PARAMS"
	if m.mode == ModeParams {
		title += "  [editing]"
	} else {
		title += "  [Tab to edit]"
	}

	var lines []string
	lines = append(lines, headerStyle.Render(title))

	var parts []string
	for i, p := range params {
		label := p.label
		value := p.value
		if m.mode == ModeParams && i == m.paramCursor {
			parts = append(parts, selectedStyle.Render(fmt.Sprintf("%s:%s", label, value)))
		} else if p.isSim {
			parts = append(parts, warningStyle.Render(fmt.Sprintf("%s:%s", label, value)))
		} else {
			parts = append(parts, dimStyle.Render(fmt.Sprintf("%s:%s", label, value)))
		}
	}
	lines = append(lines, "  "+strings.Join(parts, "  "))

	return strings.Join(lines, "\n")
}
