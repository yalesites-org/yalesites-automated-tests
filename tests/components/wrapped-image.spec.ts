import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/wrapped-image");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Wrapped Image' })).toBeVisible();
});

test("has an image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Looking down on a spiral' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('sit example doc')).toBeVisible();
  await expect(page.getByText('consectetur adipiscing elit, habitasse')).toBeVisible();
  await expect(page.getByText('Mauris praesent himenaeos')).toBeVisible();
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


