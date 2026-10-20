import { defineConfig, devices } from '@playwright/test';

const remoteURL = process.env.BASE_URL;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/browser-results.json' }]],
  use: { serviceWorkers: 'block', baseURL: remoteURL || 'http://localhost:3100', channel: process.env.PLAYWRIGHT_CHANNEL, storageState: process.env.PLAYWRIGHT_STORAGE_STATE || undefined, trace: remoteURL ? 'off' : 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: remoteURL ? undefined : { command: 'npm run start -- --port 3100', url: 'http://localhost:3100', reuseExistingServer: false, timeout: 60_000 },
});
