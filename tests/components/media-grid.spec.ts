import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/media-grid");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Media Grid Title' })).toBeVisible();
});

test("has four images", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).nth(1)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Towering shelves of books in' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Two wooden chairs in an aisle' })).toBeVisible();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true });
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
