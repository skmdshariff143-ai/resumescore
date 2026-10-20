import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const remoteURL = process.env.BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: remoteURL ? 90_000 : 45_000,
  // Remote operations include bounded 30-second transport/import requests.
  // Assertions wait on observable UI state, never fixed sleeps or test retries.
  expect: { timeout: remoteURL ? 35_000 : 5_000 },
  outputDir: process.env.E2E_ARTIFACT_DIR ? path.join(process.env.E2E_ARTIFACT_DIR, 'test-results') : 'test-results',
  reporter: [['list'], ['json', { outputFile: process.env.E2E_ARTIFACT_DIR ? path.join(process.env.E2E_ARTIFACT_DIR, 'browser-results.json') : 'test-results/browser-results.json' }]],
  use: { serviceWorkers: 'block', baseURL: remoteURL || 'http://localhost:3100', channel: process.env.PLAYWRIGHT_CHANNEL, storageState: process.env.PLAYWRIGHT_STORAGE_STATE || undefined, trace: remoteURL ? 'off' : 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: remoteURL ? undefined : { command: 'npm run start -- --port 3100', url: 'http://localhost:3100', reuseExistingServer: false, timeout: 60_000 },
});
