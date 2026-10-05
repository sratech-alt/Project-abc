import { defineConfig } from '@playwright/test';

const PORT = 4173;

/**
 * Browser tests run against the built site in `out/` (run `npm run test:e2e`, which builds first).
 * They use the Chrome already installed on this machine, so there is no browser download.
 * On a machine without Chrome: `npx playwright install chromium` and remove `channel` below.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  // A few workers only: the page does real work (animations, scroll observers) and gets slow when starved.
  workers: 4,
  expect: { timeout: 15_000 },
  reporter: [['list']],
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: 'chrome',
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
