import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  // CI runners use software-rendered WebGL: a single worker avoids two canvases
  // contending for the same CPU, and retries absorb CI-only timing flakes while
  // the failure artifact is still uploaded for evidence.
  workers: process.env.CI ? 1 : 2,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: 'npm run dev -- --port 5173',
    port: 5173,
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    actionTimeout: 25000,
  },
})
