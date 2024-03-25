import { defineConfig, devices } from "@playwright/test";

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
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  timeout: 60000,
  // Change the location of snapshots so that they aren't in our test folder
  snapshotDir: "./snapshots",
  testMatch: "**/*.spec.ts",
  testIgnore: /supportTests|destructive/i,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // use environment varaible YALESITES_URL or default to yalesites-platform.lndo.site
    baseURL: process.env.YALESITES_URL || "http://yalesites-platform.lndo.site",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.17,
      animations: "disabled",
    },
    toMatchSnapshot: {
      threshold: 0.17,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    {
      name: "setup",
      use: { contextOptions: launchOptions },
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], contextOptions: launchOptions },
      testMatch: [
        "**/*.spec.ts",
        "!destructive/*.spec.ts",
        "!supportTests/*.spec.ts",
      ],
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], contextOptions: launchOptions },
      testMatch: [
        "**/*.spec.ts",
        "!destructive/*.spec.ts",
        "!supportTests/*.spec.ts",
      ],
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], contextOptions: launchOptions },
      testMatch: [
        "**/*.spec.ts",
        "!destructive/*.spec.ts",
        "!supportTests/*.spec.ts",
      ],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'], contextOptions: launchOptions },
    // },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13 Mini"], contextOptions: launchOptions },
      testMatch: [
        "**/*.spec.ts",
        "!destructive/*.spec.ts",
        "!supportTests/*.spec.ts",
      ],
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
    {
      name: "destructive",
      testMatch: "destructive/*.spec.ts",
      testIgnore: [],
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], contextOptions: launchOptions },
    },
    {
      name: "support",
      testMatch: "supportTests/*.spec.ts",
      testIgnore: [],
      use: { ...devices["Desktop Chrome"], contextOptions: launchOptions },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
