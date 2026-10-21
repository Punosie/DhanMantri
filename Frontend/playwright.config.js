import { defineConfig, devices } from '@playwright/test';

const API_URL = process.env.E2E_API_URL || 'http://localhost:5000';
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:4317';

// Runs against the production build (vite preview) and a local backend.
// Set E2E_BASE_URL / E2E_API_URL to test a deployed environment instead.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  metadata: { apiURL: API_URL },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: 'npm start',
          cwd: '../Backend',
          url: `${API_URL}/health`,
          reuseExistingServer: true,
          env: { MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017', LOG_PRETTY: 'true' },
          timeout: 60_000,
        },
        {
          command: `npx vite build --outDir dist-e2e && npx vite preview --outDir dist-e2e --port 4317 --strictPort`,
          url: BASE_URL,
          // Always test a fresh build pointed at the local API
          reuseExistingServer: false,
          env: { VITE_API_URL: API_URL },
          timeout: 180_000,
        },
      ],
});
