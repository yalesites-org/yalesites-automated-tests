import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

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

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
});

test("should pass axe", async ({ page }) => {
  const axe_tags = [
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "best-practice",
  ];
  await expect(page).toPassAxe({ tags: axe_tags });
});
