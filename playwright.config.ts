import { defineConfig, devices } from '@playwright/test';

const launchOptions = {
  ignoreHTTPSErrors: true,
};

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  timeout: 60000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // use environment varaible YALESITES_URL or default to yalesites-platform.lndo.site
    baseURL: process.env.YALESITES_URL || 'https://yalesites-platform.lndo.site',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], contextOptions: launchOptions },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], contextOptions: launchOptions },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], contextOptions: launchOptions },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'], contextOptions: launchOptions },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'], contextOptions: launchOptions },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge', contextOptions: launchOptions },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome', contextOptions: launchOptions },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
