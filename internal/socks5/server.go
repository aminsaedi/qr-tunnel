package socks5

import (
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/aminsaedi/qr-tunnel/internal/transport"
)

const (
	socks5Version = 0x05

	// Auth methods
	authNone = 0x00

	// Commands
	cmdConnect = 0x01

	// Address types
	atypIPv4   = 0x01
	atypDomain = 0x03
	atypIPv6   = 0x04

	// Reply codes
	repSuccess         = 0x00
	repGeneralFailure  = 0x01
	repNotAllowed      = 0x02
	repNetUnreachable  = 0x03
	repHostUnreachable = 0x04
	repRefused         = 0x05
	repTTLExpired      = 0x06
	repCmdNotSupported = 0x07
	repAddrNotSupported = 0x08
)

// Server implements a SOCKS5 proxy that routes through the QR transport.
type Server struct {
	transport *transport.Transport
	listener  net.Listener
	nextID    atomic.Uint32

	// Metrics
	ActiveConns atomic.Int32
	TotalConns  atomic.Int64
}

// NewServer creates a SOCKS5 server.
func NewServer(t *transport.Transport) *Server {
	return &Server{
		transport: t,
	}
}

// Start begins listening for SOCKS5 connections.
func (s *Server) Start(addr string) error {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return fmt.Errorf("socks5 listen: %w", err)
	}
	s.listener = ln
	log.Printf("[socks5] listening on %s", addr)

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

	// Set deadline for handshake
	_ = conn.SetDeadline(time.Now().Add(10 * time.Second))

	// ---- AUTH negotiation ----
	// Client: [version][nmethods][methods...]
	header := make([]byte, 2)
	if _, err := io.ReadFull(conn, header); err != nil {
		return
	}
	if header[0] != socks5Version {
		return
	}
	nmethods := int(header[1])
	methods := make([]byte, nmethods)
	if _, err := io.ReadFull(conn, methods); err != nil {
		return
	}

	// Check for no-auth method
	hasNoAuth := false
	for _, m := range methods {
		if m == authNone {
			hasNoAuth = true
			break
		}
	}
	if !hasNoAuth {
		_, _ = conn.Write([]byte{socks5Version, 0xFF}) // no acceptable methods
		return
	}
	_, _ = conn.Write([]byte{socks5Version, authNone})

	// ---- REQUEST ----
	// Client: [version][cmd][rsv][atyp][addr][port]
	reqHeader := make([]byte, 4)
	if _, err := io.ReadFull(conn, reqHeader); err != nil {
		return
	}
	if reqHeader[0] != socks5Version {
		return
	}
	if reqHeader[1] != cmdConnect {
		sendReply(conn, repCmdNotSupported, nil, 0)
		return
	}

	// Parse destination address
	var dstAddr string
	switch reqHeader[3] {
	case atypIPv4:
		addr := make([]byte, 4)
		if _, err := io.ReadFull(conn, addr); err != nil {
			return
		}
		dstAddr = net.IP(addr).String()
	case atypDomain:
		lenBuf := make([]byte, 1)
		if _, err := io.ReadFull(conn, lenBuf); err != nil {
			return
		}
		domain := make([]byte, lenBuf[0])
		if _, err := io.ReadFull(conn, domain); err != nil {
			return
		}
		dstAddr = string(domain)
	case atypIPv6:
		addr := make([]byte, 16)
		if _, err := io.ReadFull(conn, addr); err != nil {
			return
		}
		dstAddr = net.IP(addr).String()
	default:
		sendReply(conn, repAddrNotSupported, nil, 0)
		return
	}

	portBuf := make([]byte, 2)
	if _, err := io.ReadFull(conn, portBuf); err != nil {
		return
	}
	dstPort := binary.BigEndian.Uint16(portBuf)

	dst := net.JoinHostPort(dstAddr, strconv.Itoa(int(dstPort)))
	log.Printf("[socks5] CONNECT %s", dst)

	// Clear deadline for data relay
	_ = conn.SetDeadline(time.Time{})

	// Open a transport stream with destination as SYN payload
	// Use sequential IDs starting from 1 (avoid 0 which is used for control)
	streamID := uint16(s.nextID.Add(1))
	if streamID == 0 {
		streamID = uint16(s.nextID.Add(1)) // skip 0
	}
	stream := s.transport.OpenStream(streamID, []byte(dst))

	// Wait for stream to open — longer timeout for QR video pipeline
	if err := stream.WaitOpen(90 * time.Second); err != nil {
		log.Printf("[socks5] stream open failed: %v", err)
		sendReply(conn, repHostUnreachable, nil, 0)
		stream.Close()
		return
	}

	// Success
	sendReply(conn, repSuccess, net.IPv4zero, 0)

	// Relay data bidirectionally
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

// HandleServerSide handles incoming streams on the server/exit side.
// For each accepted stream, it dials the destination and relays data.
func (s *Server) HandleServerSide() {
	for stream := range s.transport.AcceptStream() {
		go s.handleServerStream(stream)
	}
}

func (s *Server) handleServerStream(stream *transport.Stream) {
	defer stream.Close()

	// Read SYN payload to get destination
	// Give a moment for SYN payload to arrive
	time.Sleep(100 * time.Millisecond)
	synPayload := stream.ReadSYNPayload()
	if len(synPayload) == 0 {
		log.Printf("[socks5-server] stream %d: no SYN payload", stream.ID)
		return
	}

	dst := string(synPayload)
	log.Printf("[socks5-server] stream %d: waiting for first data before dialing %s", stream.ID, dst)

	// Wait for first actual data from the client (e.g., TLS ClientHello).
	// This ensures the target server receives data immediately after we connect,
	// preventing TLS timeouts.
	firstBuf := make([]byte, 4096)
	n, err := stream.Read(firstBuf)
	if err != nil || n == 0 {
		log.Printf("[socks5-server] stream %d: no data: %v", stream.ID, err)
		return
	}
	firstData := firstBuf[:n]
	hexPrefix := fmt.Sprintf("%x", firstData[:min(20, len(firstData))])
	log.Printf("[socks5-server] stream %d: got %d bytes (hex: %s), dialing %s", stream.ID, n, hexPrefix, dst)

	conn, err := net.DialTimeout("tcp", dst, 10*time.Second)
	if err != nil {
		log.Printf("[socks5-server] dial failed: %v", err)
		return
	}
	defer conn.Close()

	// Send the buffered first data immediately
	if _, err := conn.Write(firstData); err != nil {
		log.Printf("[socks5-server] write first data failed: %v", err)
		return
	}

	// Relay bidirectionally
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		_, _ = io.Copy(conn, stream)
	}()

	go func() {
		defer wg.Done()
		_, _ = io.Copy(stream, conn)
	}()

	wg.Wait()
}

func sendReply(conn net.Conn, rep byte, bindAddr net.IP, bindPort uint16) {
	reply := []byte{
		socks5Version,
		rep,
		0x00, // reserved
		atypIPv4,
	}
	if bindAddr == nil {
		reply = append(reply, 0, 0, 0, 0)
	} else {
		reply = append(reply, bindAddr.To4()...)
	}
	port := make([]byte, 2)
	binary.BigEndian.PutUint16(port, bindPort)
	reply = append(reply, port...)
	_, _ = conn.Write(reply)
}

// Close stops the SOCKS5 server.
func (s *Server) Close() error {
	if s.listener != nil {
		return s.listener.Close()
	}
	return nil
}

// io.ReadWriter implementation for Stream
var _ io.ReadWriter = (*transport.Stream)(nil)
