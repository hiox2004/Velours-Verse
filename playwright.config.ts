import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  webServer: {
    command: 'node ./node_modules/vite/bin/vite.js --port 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off'
  }
});
