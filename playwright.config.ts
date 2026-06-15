import { defineConfig, devices } from "@playwright/test";

const launchOptions = {
  ignoreHTTPSErrors: true,
};

const isPantheon = (process.env.YALESITES_URL || '').includes('pantheonsite.io');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI; also retry against Pantheon sandboxes, which are slow to warm
     up — a single cold-load hiccup should self-heal rather than fail the run. */
  retries: process.env.CI ? 2 : (isPantheon ? 2 : 0),
  /* Limit workers to reduce Drupal database contention and avoid hammering the
     slow Pantheon sandboxes. */
  workers: process.env.CI ? 1 : (isPantheon ? 1 : 4),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* reporter: [["html", { open: "never" }]], */
  reporter: [["html"]],
  /* Generous per-test budget; Pantheon sandboxes need extra time to render. */
  timeout: isPantheon ? 180000 : 120000,
  // Change the location of snapshots so that they aren't in our test folder
  snapshotDir: "./snapshots",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // use environment varaible YALESITES_URL or default to yalesites-platform.lndo.site
    baseURL:
      process.env.YALESITES_URL || "http://yalesites-platform.lndo.site",
    
    /* Navigation timeout for slow Drupal responses; longer for cold Pantheon sandboxes. */
    navigationTimeout: isPantheon ? 90000 : 60000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], contextOptions: launchOptions },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], contextOptions: launchOptions },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], contextOptions: launchOptions },
    },

    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13 Mini"], contextOptions: launchOptions },
      // Include both the per-component visual regression tests and the
      // all-vis-reg A/B comparison ("should compare ...") tests.
      grep: /should match previous screenshot|should compare/,
    },

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
