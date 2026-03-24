package webui

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/coder/websocket"

	"github.com/aminsaedi/qr-tunnel/internal/tui"
)

//go:embed static/*
var staticFiles embed.FS

// Server serves the optional web UI.
type Server struct {
	metrics    *tui.MetricsSource
	clients    map[*websocket.Conn]bool
	mu         sync.Mutex
	httpServer *http.Server
}

func NewServer(metrics *tui.MetricsSource) *Server {
	return &Server{
		metrics: metrics,
		clients: make(map[*websocket.Conn]bool),
	}
}

// Start begins serving the web UI on the given address.
func (s *Server) Start(addr string) error {
	mux := http.NewServeMux()

	// Serve embedded static files
	staticFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		return fmt.Errorf("embed: %w", err)
	}
	fileServer := http.FileServer(http.FS(staticFS))

	// Route /simlab to simlab.html
	mux.HandleFunc("/simlab", func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = "/simlab.html"
		fileServer.ServeHTTP(w, r)
	})
	mux.Handle("/", fileServer)

	// WebSocket for live metrics
	mux.HandleFunc("/ws", s.handleMetricsWS)

	// API endpoints for simulation controls
	mux.HandleFunc("/api/sim", s.handleSim)
	mux.HandleFunc("/api/metrics", s.handleMetricsAPI)

	s.httpServer = &http.Server{
		Addr:    addr,
		Handler: mux,
	}

	// Start metrics broadcast
	go s.broadcastLoop()

	log.Printf("[webui] serving on http://%s", addr)
	go func() {
		if err := s.httpServer.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf("[webui] server error: %v", err)
		}
	}()

	return nil
}

func (s *Server) handleMetricsWS(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		log.Printf("[webui] ws accept error: %v", err)
		return
	}

	s.mu.Lock()
	s.clients[conn] = true
	s.mu.Unlock()

	// Keep connection alive; remove on close
	ctx := conn.CloseRead(r.Context())
	<-ctx.Done()

	s.mu.Lock()
	delete(s.clients, conn)
	s.mu.Unlock()
}

func (s *Server) broadcastLoop() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		data := s.collectMetrics()
		jsonData, _ := json.Marshal(data)

		s.mu.Lock()
		for conn := range s.clients {
			ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
			err := conn.Write(ctx, websocket.MessageText, jsonData)
			cancel()
			if err != nil {
				conn.Close(websocket.StatusNormalClosure, "")
				delete(s.clients, conn)
			}
		}
		s.mu.Unlock()
	}
}

type metricsPayload struct {
	WebRTCState   string    `json:"webrtcState"`
	TXRate        float64   `json:"txRate"`
	RXRate        float64   `json:"rxRate"`
	QREncodeFPS   float64   `json:"qrEncodeFps"`
	QRDecodeFPS   float64   `json:"qrDecodeFps"`
	DecodeOK      float64   `json:"decodeOk"`
	ActiveStreams  int       `json:"activeStreams"`
	RTTMs         int64     `json:"rttMs"`
	ActiveConns   int       `json:"activeConns"`
	QRVersion     int       `json:"qrVersion"`
	ECC           string    `json:"ecc"`
	FPS           int       `json:"fps"`
	ChunkSize     int       `json:"chunkSize"`
	DropRate      int       `json:"dropRate"`
	NoisePct      int       `json:"noisePct"`
	DelayMs       int       `json:"delayMs"`
	Timestamp     time.Time `json:"timestamp"`
}

func (s *Server) collectMetrics() metricsPayload {
	rtt := s.metrics.RTTEstimate.Load().(time.Duration)
	return metricsPayload{
		WebRTCState:  s.metrics.WebRTCState.Load().(string),
		TXRate:       s.metrics.TXRate.Load().(float64),
		RXRate:       s.metrics.RXRate.Load().(float64),
		QREncodeFPS:  s.metrics.QREncodeFPS.Load().(float64),
		QRDecodeFPS:  s.metrics.QRDecodeFPS.Load().(float64),
		DecodeOK:     s.metrics.DecodeOK.Load().(float64),
		ActiveStreams: int(s.metrics.ActiveStreams.Load()),
		RTTMs:        rtt.Milliseconds(),
		ActiveConns:  int(s.metrics.ActiveConns.Load()),
		QRVersion:    int(s.metrics.QRVersion.Load()),
		ECC:          s.metrics.ECC.Load().(string),
		FPS:          int(s.metrics.FPS.Load()),
		ChunkSize:    int(s.metrics.ChunkSize.Load()),
		DropRate:     int(s.metrics.DropRate.Load()),
		NoisePct:     int(s.metrics.NoisePct.Load()),
		DelayMs:      int(s.metrics.DelayMs.Load()),
		Timestamp:    time.Now(),
	}
}

func (s *Server) handleMetricsAPI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.collectMetrics())
}

type simRequest struct {
	DropRate  *int `json:"dropRate"`
	NoisePct  *int `json:"noisePct"`
	DelayMs   *int `json:"delayMs"`
	QRVersion *int `json:"qrVersion"`
	FPS       *int `json:"fps"`
	ChunkSize *int `json:"chunkSize"`
}

func (s *Server) handleSim(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"dropRate":  s.metrics.DropRate.Load(),
			"noisePct":  s.metrics.NoisePct.Load(),
			"delayMs":   s.metrics.DelayMs.Load(),
			"qrVersion": s.metrics.QRVersion.Load(),
			"fps":       s.metrics.FPS.Load(),
			"chunkSize": s.metrics.ChunkSize.Load(),
		})
		return
	}

	if r.Method != "POST" {
		http.Error(w, "method not allowed", 405)
		return
	}

	var req simRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	if req.DropRate != nil {
		s.metrics.DropRate.Store(int32(*req.DropRate))
	}
	if req.NoisePct != nil {
		s.metrics.NoisePct.Store(int32(*req.NoisePct))
	}
	if req.DelayMs != nil {
		s.metrics.DelayMs.Store(int32(*req.DelayMs))
	}
	if req.QRVersion != nil {
		s.metrics.QRVersion.Store(int32(*req.QRVersion))
	}
	if req.FPS != nil {
		s.metrics.FPS.Store(int32(*req.FPS))
	}
	if req.ChunkSize != nil {
		s.metrics.ChunkSize.Store(int32(*req.ChunkSize))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (s *Server) Close() error {
	if s.httpServer != nil {
		return s.httpServer.Close()
	}
	return nil
}

