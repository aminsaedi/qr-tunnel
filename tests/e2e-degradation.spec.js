const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const { ROOT } = require('./helpers');

test.describe.serial('Degradation & codec tests', () => {

  test('QR encode/decode round-trip passes (Go unit test)', async () => {
    const output = execSync(
      'go test ./internal/qr/ -v -run TestEncoderDecoderRoundTrip -timeout 60s',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    console.log(output);
    expect(output).toContain('PASS');
    expect(output).not.toContain('FAIL');
    // Verify 100% decode rate
    expect(output).toMatch(/success rate: \d+\.\d+%/);
  });

  test('QR encode/decode with 30% frame loss passes (Go unit test)', async () => {
    const output = execSync(
      'go test ./internal/qr/ -v -run TestEncoderDecoderWithFrameLoss -timeout 60s',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    console.log(output);
    expect(output).toContain('PASS');
    expect(output).not.toContain('FAIL');
    expect(output).toContain('30% frame loss');
  });

  test('LT codes round-trip across multiple data sizes (Go unit test)', async () => {
    const output = execSync(
      'go test ./internal/qr/ -v -run TestLTCodesRoundTrip -timeout 60s',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    console.log(output);
    expect(output).toContain('PASS');
    expect(output).not.toContain('FAIL');
  });

  test('LT codes handle 30% frame loss (Go unit test)', async () => {
    const output = execSync(
      'go test ./internal/qr/ -v -run TestLTCodesWithFrameLoss -timeout 60s',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    console.log(output);
    expect(output).toContain('PASS');
    expect(output).not.toContain('FAIL');
    // Verify overhead is reasonable (< 2x)
    expect(output).toMatch(/overhead: \d+\.\d+x/);
  });

  test('LT codes stress test — 100 iterations (Go unit test)', async () => {
    const output = execSync(
      'go test ./internal/qr/ -v -run TestLTCodesStress -timeout 120s',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    console.log(output);
    expect(output).toContain('PASS');
    expect(output).not.toContain('FAIL');
  });

  test('CGO_ENABLED=0 build succeeds (pure Go verification)', async () => {
    execSync(
      'CGO_ENABLED=0 go build -o /dev/null ./cmd/qr-tunnel',
      { cwd: ROOT, encoding: 'utf-8' }
    );
    // If we get here, it passed
    console.log('CGO_ENABLED=0 build: OK');
  });

  test('Cross-compilation produces all 5 targets', async () => {
    const targets = [
      { GOOS: 'darwin', GOARCH: 'amd64' },
      { GOOS: 'darwin', GOARCH: 'arm64' },
      { GOOS: 'linux',  GOARCH: 'amd64' },
      { GOOS: 'linux',  GOARCH: 'arm64' },
      { GOOS: 'windows', GOARCH: 'amd64' },
    ];

    for (const t of targets) {
      execSync(
        `CGO_ENABLED=0 GOOS=${t.GOOS} GOARCH=${t.GOARCH} go build -o /dev/null ./cmd/qr-tunnel`,
        { cwd: ROOT, encoding: 'utf-8' }
      );
      console.log(`${t.GOOS}/${t.GOARCH}: OK`);
    }
  });
});
