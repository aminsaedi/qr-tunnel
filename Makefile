BINARY     = qr-tunnel
VERSION    = $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
LDFLAGS    = -ldflags="-s -w -X main.Version=$(VERSION)"

build:
	go build $(LDFLAGS) -o $(BINARY) ./cmd/qr-tunnel

build-all: dist/
	GOOS=darwin  GOARCH=amd64  go build $(LDFLAGS) -o dist/$(BINARY)-macos-amd64  ./cmd/qr-tunnel
	GOOS=darwin  GOARCH=arm64  go build $(LDFLAGS) -o dist/$(BINARY)-macos-arm64  ./cmd/qr-tunnel
	GOOS=linux   GOARCH=amd64  go build $(LDFLAGS) -o dist/$(BINARY)-linux-amd64  ./cmd/qr-tunnel
	GOOS=linux   GOARCH=arm64  go build $(LDFLAGS) -o dist/$(BINARY)-linux-arm64  ./cmd/qr-tunnel
	GOOS=windows GOARCH=amd64  go build $(LDFLAGS) -o dist/$(BINARY)-windows-amd64.exe ./cmd/qr-tunnel

compress: build-all
	which upx && upx --best dist/* || echo "upx not found, skipping"

test:
	go test ./... -v -race -timeout 120s

test-e2e:
	cd tests && npm install && npx playwright test --headed

lint:
	which golangci-lint && golangci-lint run || go vet ./...

dist/:
	mkdir -p dist

clean:
	rm -rf dist/ $(BINARY)

.PHONY: build build-all compress test test-e2e lint clean
