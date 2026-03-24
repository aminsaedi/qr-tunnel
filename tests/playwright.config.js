const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 90000,
  retries: 0,
  // Run tests serially to avoid port conflicts
  workers: 1,
  // Fail fast
  maxFailures: 0,
  use: {
    headless: true,
    launchOptions: {
      args: [
        '--use-fake-device-for-media-stream',
        '--use-fake-ui-for-media-stream',
        '--allow-running-insecure-content',
        '--no-sandbox',
      ],
    },
  },
  reporter: [['list']],
});
