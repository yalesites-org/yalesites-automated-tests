import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/view");
  await page.waitForLoadState("load");
});

test("has a heading for the view", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'View Heading' })).toBeVisible();
});

test("has the first event", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Michael Vaughn wearing a' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dinner with Dad' })).toBeVisible();
  await expect(page.getByText('Tuesday, May 5,')).toBeVisible();
  await expect(page.getByText('This is some teaser text')).toBeVisible();
});

test("has the second event", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Two wooden chairs in an aisle' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'MichaelCON' })).toBeVisible();
  await expect(page.getByText('Thursday, July 3,')).toBeVisible();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.17 });
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
