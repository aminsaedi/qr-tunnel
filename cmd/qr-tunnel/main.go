package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/bitmap"
	"github.com/aminsaedi/qr-tunnel/internal/httpproxy"
	"github.com/aminsaedi/qr-tunnel/internal/provider"
	baleProvider "github.com/aminsaedi/qr-tunnel/internal/provider/bale"
	webrtcProvider "github.com/aminsaedi/qr-tunnel/internal/provider/webrtc"
	"github.com/aminsaedi/qr-tunnel/internal/socks5"
	"github.com/aminsaedi/qr-tunnel/internal/transport"
	"github.com/aminsaedi/qr-tunnel/internal/tui"
	"github.com/aminsaedi/qr-tunnel/internal/webui"
)

var Version = "dev"

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	switch os.Args[1] {
	case "version":
		fmt.Printf("qr-tunnel %s\n", Version)
	case "client":
		runClient(os.Args[2:])
	case "server":
		runServer(os.Args[2:])
	case "connect":
		runConnect(os.Args[2:])
	case "bale-client":
		runBaleClient(os.Args[2:])
	case "bale-server":
		runBaleServer(os.Args[2:])
	case "--help", "-h", "help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Fprintf(os.Stderr, `qr-tunnel %s — TCP tunnel over video calls using bitmap codec

Usage:
  qr-tunnel client      [flags]  Client mode (SOCKS5 proxy + TUI)
  qr-tunnel server      [flags]  Server mode (exit node + TUI)
  qr-tunnel connect     [flags]  Simple connect (debug mode, no TUI)
  qr-tunnel bale-client [flags]  Bale messenger client (SOCKS5 via Bale video call)
  qr-tunnel bale-server [flags]  Bale messenger server (exit node via Bale video call)
  qr-tunnel version              Show version

Common Flags:
  --signaling       Signaling server URL (default: ws://localhost:3000)
  --role            caller|callee (default: callee)
  --gui             Enable web UI at address (e.g., :8080)
  --fps             Frames per second for send loop (default: 15)
  --block-size      Bitmap block size in pixels (default: 16)
  --bits-per-block  Bits per block 1|2 (default: 2)
  --log             Log level: debug|info|warn (default: info)

Client-only Flags:
  --socks5       SOCKS5 listen address (default: :1080)

`, Version)
}

type commonFlags struct {
	signaling    string
	role         string
	gui          string
	fps          int
	blockSize    int
	bitsPerBlock int
	logLevel     string
}

func addCommonFlags(fs *flag.FlagSet) *commonFlags {
	f := &commonFlags{}
	fs.StringVar(&f.signaling, "signaling", "ws://localhost:3000", "signaling server URL")
	fs.StringVar(&f.role, "role", "callee", "caller or callee")
	fs.StringVar(&f.gui, "gui", "", "web UI listen address (e.g., :8080)")
	fs.IntVar(&f.fps, "fps", 15, "send loop frames per second")
	fs.IntVar(&f.blockSize, "block-size", 16, "bitmap block size in pixels")
	fs.IntVar(&f.bitsPerBlock, "bits-per-block", 2, "bits per block (1 or 2)")
	fs.StringVar(&f.logLevel, "log", "info", "log level: debug|info|warn")
	return f
}

func (f *commonFlags) bitmapConfig() bitmap.Config {
	return bitmap.Config{
		BlockSize:    f.blockSize,
		BitsPerBlock: f.bitsPerBlock,
	}
}

func runClient(args []string) {
	fs := flag.NewFlagSet("client", flag.ExitOnError)
	cf := addCommonFlags(fs)
	socksAddr := fs.String("socks5", ":1080", "SOCKS5 listen address")
	_ = fs.Parse(args)

	log.SetFlags(log.Ltime | log.Lmicroseconds)

	// Initialize metrics
	metrics := tui.NewMetricsSource()
	metrics.SignalingURL.Store(cf.signaling)
	metrics.SOCKS5Addr.Store(*socksAddr)
	metrics.QRVersion.Store(int32(cf.blockSize))
	metrics.ECC.Store(fmt.Sprintf("%dbpp", cf.bitsPerBlock))
	metrics.FPS.Store(int32(cf.fps))
	metrics.ChunkSize.Store(int32(cf.bitmapConfig().MaxPayloadBytes()))

	// Create provider
	p := webrtcProvider.NewWebRTCProvider()
	p.OnState(func(state provider.State) {
		metrics.WebRTCState.Store(state.String())
		log.Printf("[state] %s", state)
	})

	// Connect
	log.Printf("connecting to %s as %s...", cf.signaling, cf.role)
	if err := p.Connect(cf.signaling, provider.CallOptions{Role: cf.role}); err != nil {
		log.Fatalf("connect failed: %v", err)
	}

	// Create transport
	tConfig := transport.DefaultConfig()
	tConfig.BitmapConfig = cf.bitmapConfig()
	tConfig.FPS = cf.fps
	tr := transport.NewTransport(p, tConfig)
	defer tr.Close()

	// Start SOCKS5
	socksServer := socks5.NewServer(tr)
	if err := socksServer.Start(*socksAddr); err != nil {
		log.Fatalf("socks5 start failed: %v", err)
	}
	defer socksServer.Close()
	log.Printf("[socks5] listening on %s", *socksAddr)

	// Start web UI if requested
	if cf.gui != "" {
		webServer := webui.NewServer(metrics)
		if err := webServer.Start(cf.gui); err != nil {
			log.Fatalf("webui start failed: %v", err)
		}
		defer webServer.Close()
	}

	// Start metrics updater
	go updateMetrics(metrics, tr, socksServer)

	// Run TUI (blocks)
	if err := tui.Run(metrics, "client", Version); err != nil {
		log.Printf("TUI error: %v", err)
	}

	log.Println("shutting down...")
}

func runServer(args []string) {
	fs := flag.NewFlagSet("server", flag.ExitOnError)
	cf := addCommonFlags(fs)
	_ = fs.Parse(args)

	log.SetFlags(log.Ltime | log.Lmicroseconds)

	// Initialize metrics
	metrics := tui.NewMetricsSource()
	metrics.SignalingURL.Store(cf.signaling)
	metrics.QRVersion.Store(int32(cf.blockSize))
	metrics.ECC.Store(fmt.Sprintf("%dbpp", cf.bitsPerBlock))
	metrics.FPS.Store(int32(cf.fps))
	metrics.ChunkSize.Store(int32(cf.bitmapConfig().MaxPayloadBytes()))

	// Create provider
	p := webrtcProvider.NewWebRTCProvider()
	p.OnState(func(state provider.State) {
		metrics.WebRTCState.Store(state.String())
		log.Printf("[state] %s", state)
	})

	// Connect
	log.Printf("connecting to %s as %s...", cf.signaling, cf.role)
	if err := p.Connect(cf.signaling, provider.CallOptions{Role: cf.role}); err != nil {
		log.Fatalf("connect failed: %v", err)
	}

	// Create transport
	tConfig := transport.DefaultConfig()
	tConfig.BitmapConfig = cf.bitmapConfig()
	tConfig.FPS = cf.fps
	tr := transport.NewTransport(p, tConfig)
	defer tr.Close()

	// Start accepting streams (server side handles SOCKS5 exit)
	socksServer := socks5.NewServer(tr)
	go socksServer.HandleServerSide()

	// Start web UI if requested
	if cf.gui != "" {
		webServer := webui.NewServer(metrics)
		if err := webServer.Start(cf.gui); err != nil {
			log.Fatalf("webui start failed: %v", err)
		}
		defer webServer.Close()
	}

	// Start metrics updater
	go updateMetrics(metrics, tr, socksServer)

	// Run TUI (blocks)
	if err := tui.Run(metrics, "server", Version); err != nil {
		log.Printf("TUI error: %v", err)
	}

	log.Println("shutting down...")
}

// runConnect is a simple debug mode without TUI
func runConnect(args []string) {
	fs := flag.NewFlagSet("connect", flag.ExitOnError)
	cf := addCommonFlags(fs)
	testFrames := fs.Bool("test-frames", false, "send test pattern frames")
	_ = fs.Parse(args)

	log.SetFlags(log.Ltime | log.Lmicroseconds)
	log.Printf("qr-tunnel %s — connect mode", Version)

	// Initialize metrics for web UI
	metrics := tui.NewMetricsSource()
	metrics.SignalingURL.Store(cf.signaling)

	p := webrtcProvider.NewWebRTCProvider()
	p.OnState(func(state provider.State) {
		metrics.WebRTCState.Store(state.String())
		log.Printf("[state] %s", state)
	})

	frameCount := 0
	p.OnFrame(func(f *provider.Frame) {
		frameCount++
		if frameCount%30 == 1 {
			log.Printf("[rx] frame #%d (%dx%d)", frameCount, f.Width, f.Height)
		}
	})

	// Start web UI BEFORE connect (connect can block waiting for peer)
	if cf.gui != "" {
		webServer := webui.NewServer(metrics)
		if err := webServer.Start(cf.gui); err != nil {
			log.Fatalf("webui start failed: %v", err)
		}
		defer webServer.Close()
		log.Printf("[webui] serving on http://%s", cf.gui)
	}

	log.Printf("connecting to %s as %s...", cf.signaling, cf.role)
	if err := p.Connect(cf.signaling, provider.CallOptions{Role: cf.role}); err != nil {
		log.Fatalf("connect failed: %v", err)
	}

	if *testFrames {
		go func() {
			log.Println("[tx] sending test frames at 15fps")
			enc := bitmap.NewEncoder(cf.bitmapConfig())
			ticker := time.NewTicker(time.Second / 15)
			defer ticker.Stop()
			var n uint16
			for range ticker.C {
				n++
				frame := enc.EncodePacket(n, []byte(fmt.Sprintf("test-frame-%d", n)))
				if frame == nil {
					continue
				}
				if err := p.SendFrame(&provider.Frame{Image: frame, Width: bitmap.FrameWidth, Height: bitmap.FrameHeight}); err != nil {
					if n%30 == 1 {
						log.Printf("[tx] error: %v", err)
					}
				} else if n%30 == 1 {
					log.Printf("[tx] sent frame #%d", n)
				}
			}
		}()
	}

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh
	log.Printf("shutting down (rx: %d frames)...", frameCount)
	p.Close()
}

func updateMetrics(metrics *tui.MetricsSource, tr *transport.Transport, socksServer *socks5.Server) {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	var lastBytesSent, lastBytesRecv int64
	lastTime := time.Now()

	for range ticker.C {
		m := tr.Metrics()
		now := time.Now()
		elapsed := now.Sub(lastTime).Seconds()

		if elapsed > 0 {
			txRate := float64(m.BytesSent-lastBytesSent) / elapsed / 1024
			rxRate := float64(m.BytesReceived-lastBytesRecv) / elapsed / 1024
			metrics.TXRate.Store(txRate)
			metrics.RXRate.Store(rxRate)
		}

		lastBytesSent = m.BytesSent
		lastBytesRecv = m.BytesReceived
		lastTime = now

		metrics.ActiveStreams.Store(int32(m.ActiveStreams))
		metrics.RTTEstimate.Store(m.RTTEstimate)
		metrics.DecodeOK.Store(m.DecodeRate)

		if socksServer != nil {
			metrics.ActiveConns.Store(socksServer.ActiveConns.Load())
		}
	}
}

// --- Bale integration commands ---

func runBaleClient(args []string) {
	fs := flag.NewFlagSet("bale-client", flag.ExitOnError)
	bridge := fs.String("bridge", "ws://localhost:9000", "browser bridge WebSocket URL")
	socksAddr := fs.String("socks5", ":1080", "SOCKS5 listen address")
	httpAddr := fs.String("http", ":8080", "HTTP CONNECT proxy address (for Telegram)")
	fps := fs.Int("fps", 15, "send loop frames per second")
	blockSize := fs.Int("block-size", 16, "bitmap block size in pixels")
	bitsPerBlock := fs.Int("bits-per-block", 2, "bits per block (1 or 2)")
	_ = fs.Parse(args)

	log.SetFlags(log.Ltime | log.Lmicroseconds)
	log.Printf("qr-tunnel %s — Bale client mode", Version)
	log.Printf("bridge: %s, socks5: %s, http: %s", *bridge, *socksAddr, *httpAddr)

	p := baleProvider.NewBaleProvider()
	p.OnState(func(state provider.State) {
		log.Printf("[state] %s", state)
	})

	if err := p.Connect(*bridge, provider.CallOptions{Role: "caller"}); err != nil {
		log.Fatalf("bridge connect failed: %v", err)
	}
	defer p.Close()

	// Create transport
	tConfig := transport.DefaultConfig()
	tConfig.BitmapConfig = bitmap.Config{
		BlockSize:    *blockSize,
		BitsPerBlock: *bitsPerBlock,
	}
	tConfig.FPS = *fps
	tr := transport.NewTransport(p, tConfig)
	defer tr.Close()

	// Start SOCKS5
	socksServer := socks5.NewServer(tr)
	if err := socksServer.Start(*socksAddr); err != nil {
		log.Fatalf("socks5 start failed: %v", err)
	}
	defer socksServer.Close()
	log.Printf("[socks5] SOCKS proxy on %s", *socksAddr)

	// Start HTTP CONNECT proxy (for Telegram compatibility)
	httpServer := httpproxy.NewServer(tr)
	if err := httpServer.Start(*httpAddr); err != nil {
		log.Fatalf("http proxy start failed: %v", err)
	}
	defer httpServer.Close()
	log.Printf("[http-proxy] HTTP CONNECT proxy on %s", *httpAddr)

	log.Println("")
	log.Println("=== PROXY READY ===")
	log.Printf("  SOCKS5: localhost%s", *socksAddr)
	log.Printf("  HTTP:   localhost%s (for Telegram)", *httpAddr)
	log.Println("")

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh
	log.Println("shutting down...")
}

func runBaleServer(args []string) {
	fs := flag.NewFlagSet("bale-server", flag.ExitOnError)
	bridge := fs.String("bridge", "ws://localhost:9001", "browser bridge WebSocket URL")
	fps := fs.Int("fps", 15, "send loop frames per second")
	blockSize := fs.Int("block-size", 16, "bitmap block size in pixels")
	bitsPerBlock := fs.Int("bits-per-block", 2, "bits per block (1 or 2)")
	_ = fs.Parse(args)

	log.SetFlags(log.Ltime | log.Lmicroseconds)
	log.Printf("qr-tunnel %s — Bale server mode", Version)
	log.Printf("bridge: %s", *bridge)

	p := baleProvider.NewBaleProvider()
	p.OnState(func(state provider.State) {
		log.Printf("[state] %s", state)
	})

	if err := p.Connect(*bridge, provider.CallOptions{Role: "callee"}); err != nil {
		log.Fatalf("bridge connect failed: %v", err)
	}
	defer p.Close()

	// Create transport
	tConfig := transport.DefaultConfig()
	tConfig.BitmapConfig = bitmap.Config{
		BlockSize:    *blockSize,
		BitsPerBlock: *bitsPerBlock,
	}
	tConfig.FPS = *fps
	tr := transport.NewTransport(p, tConfig)
	defer tr.Close()

	// Accept streams and dial real TCP destinations (exit node)
	socksServer := socks5.NewServer(tr)
	go socksServer.HandleServerSide()
	log.Printf("[server] exit node ready — accepting tunnel streams")

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh
	log.Println("shutting down...")
}
