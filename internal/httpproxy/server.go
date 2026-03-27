package httpproxy

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/transport"
)

// MaxConcurrentStreams limits parallel tunnel streams to prevent overwhelming
// the low-bandwidth bitmap channel. Telegram needs just 1-2 working connections.
// Excess connections queue (up to 30s) — Telegram retries automatically.
const MaxConcurrentStreams = 2

// Server implements an HTTP CONNECT proxy that routes through the QR transport.
// This is compatible with Telegram's HTTP proxy setting.
type Server struct {
	transport *transport.Transport
	listener  net.Listener
	nextID    atomic.Uint32
	streamSem chan struct{} // concurrency limiter

	ActiveConns atomic.Int32
	TotalConns  atomic.Int64
}

func NewServer(t *transport.Transport) *Server {
	return &Server{
		transport: t,
		streamSem: make(chan struct{}, MaxConcurrentStreams),
	}
}

func (s *Server) Start(addr string) error {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("http proxy listen: %w", err)
	}
	s.listener = ln
	log.Printf("[http-proxy] listening on %s", addr)
	go s.acceptLoop()
	return nil
}

func (s *Server) acceptLoop() {
	for {
		conn, err := s.listener.Accept()
		if err != nil {
			return
		}
		s.TotalConns.Add(1)
		s.ActiveConns.Add(1)
		go s.handleConn(conn)
	}
}

func (s *Server) handleConn(conn net.Conn) {
	defer func() {
		conn.Close()
		s.ActiveConns.Add(-1)
	}()

	_ = conn.SetDeadline(time.Now().Add(30 * time.Second))

	br := bufio.NewReader(conn)
	req, err := http.ReadRequest(br)
	if err != nil {
		return
	}

	if req.Method == "CONNECT" {
		s.handleConnect(conn, req)
	} else {
		// For non-CONNECT requests, forward as HTTP proxy
		s.handleHTTP(conn, req)
	}
}

// handleConnect handles CONNECT method (used by Telegram for MTProto)
func (s *Server) handleConnect(conn net.Conn, req *http.Request) {
	dst := req.Host
	if _, _, err := net.SplitHostPort(dst); err != nil {
		dst = net.JoinHostPort(dst, "443") // default HTTPS port
	}

	// Reject IPv6 — server likely has no IPv6, saves tunnel bandwidth
	host, _, _ := net.SplitHostPort(dst)
	if strings.Contains(host, ":") {
		log.Printf("[http-proxy] CONNECT %s: rejecting IPv6", dst)
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 502 Bad Gateway\r\n\r\n")
		return
	}

	log.Printf("[http-proxy] CONNECT %s (waiting for slot, %d/%d)", dst, len(s.streamSem), MaxConcurrentStreams)

	// Limit concurrent stream SETUP only
	select {
	case s.streamSem <- struct{}{}:
	case <-time.After(10 * time.Second):
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 503 Service Unavailable\r\n\r\n")
		return
	}

	_ = conn.SetDeadline(time.Time{})

	streamID := s.transport.NextStreamID()
	stream := s.transport.OpenStream(streamID, []byte(dst))

	if err := stream.WaitOpen(15 * time.Second); err != nil {
		<-s.streamSem
		log.Printf("[http-proxy] stream open failed: %v", err)
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 502 Bad Gateway\r\n\r\n")
		stream.Close()
		return
	}
	<-s.streamSem // release — stream established

	// Send 200 Connection Established
	_, _ = fmt.Fprintf(conn, "HTTP/1.1 200 Connection Established\r\n\r\n")

	// Relay bidirectionally
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		_, _ = io.Copy(stream, conn)
		stream.Close()
	}()

	go func() {
		defer wg.Done()
		_, _ = io.Copy(conn, stream)
		conn.Close()
	}()

	wg.Wait()
}

// handleHTTP forwards non-CONNECT HTTP requests through the tunnel
func (s *Server) handleHTTP(conn net.Conn, req *http.Request) {
	host := req.Host
	if _, _, err := net.SplitHostPort(host); err != nil {
		host = net.JoinHostPort(host, "80")
	}

	// Reject IPv6
	h, _, _ := net.SplitHostPort(host)
	if strings.Contains(h, ":") {
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 502 Bad Gateway\r\n\r\n")
		return
	}

	log.Printf("[http-proxy] HTTP %s %s", req.Method, req.URL)

	select {
	case s.streamSem <- struct{}{}:
	case <-time.After(10 * time.Second):
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 503 Service Unavailable\r\n\r\n")
		return
	}

	_ = conn.SetDeadline(time.Time{})

	streamID := s.transport.NextStreamID()
	stream := s.transport.OpenStream(streamID, []byte(host))

	if err := stream.WaitOpen(15 * time.Second); err != nil {
		<-s.streamSem
		log.Printf("[http-proxy] stream open failed: %v", err)
		_, _ = fmt.Fprintf(conn, "HTTP/1.1 502 Bad Gateway\r\n\r\n")
		stream.Close()
		return
	}
	<-s.streamSem

	// Forward the original request to the stream
	_ = req.Write(stream)

	// Relay response back
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		_, _ = io.Copy(conn, stream)
		conn.Close()
	}()

	go func() {
		defer wg.Done()
		_, _ = io.Copy(stream, conn)
		stream.Close()
	}()

	wg.Wait()
}

func (s *Server) Close() error {
	if s.listener != nil {
		return s.listener.Close()
	}
	return nil
}
