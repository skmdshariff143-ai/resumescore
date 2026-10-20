import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: ['**/workflow.spec.ts', '**/*.cross.ts'],
  // Playwright page.pdf() is Chromium-only. The unchanged Chromium suite tests
  // selectable PDF generation/re-upload; native Firefox/WebKit printing is manual.
  grepInvert: /printable export produces a selectable PDF that can be uploaded again/,
  use: { ...base.use, channel: undefined },
  projects: [
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'], browserName: 'firefox' } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], browserName: 'webkit' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
});
