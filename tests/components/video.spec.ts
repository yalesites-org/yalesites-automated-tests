import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/video");
  await page.waitForLoadState("load");
});

test("has a video", async ({ page }) => {
  await expect(page.frameLocator('iframe[title="What Is Drupal\\? \\| Drupal For Absolute Beginners"]').frameLocator('iframe[title="What Is Drupal\\? \\| Drupal For Absolute Beginners"]').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
});

test("Has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Video Title' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem example page')).toBeVisible();
});

a11yTests();
visRegTests();