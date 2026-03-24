package tui

import (
	tea "github.com/charmbracelet/bubbletea"
)

// Run starts the TUI and blocks until it exits.
func Run(metrics *MetricsSource, role, version string) error {
	model := NewModel(metrics, role, version)
	p := tea.NewProgram(model, tea.WithAltScreen())
	_, err := p.Run()
	return err
}
