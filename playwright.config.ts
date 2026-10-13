import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Chrome (1440px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1024 },
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 1024 },
      },
    },
    {
      name: 'Desktop WebKit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 1024 },
      },
    },
    {
      name: 'Mobile Safari (iPhone 14) (emulated)',
      use: {
        ...devices['iPhone 14'],
      },
    },
    {
      name: 'Mobile Android (Pixel 7) (emulated)',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'Tablet (768px)',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
