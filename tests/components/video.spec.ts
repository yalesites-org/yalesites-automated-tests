import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "video");
});

test("has a video", async ({ page }) => {
  await expect(page.frameLocator('iframe[title="What Is Drupal\\? \\| Drupal For Absolute Beginners"]').frameLocator('iframe[title="What Is Drupal\\? \\| Drupal For Absolute Beginners"]').locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Video Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem example page')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();