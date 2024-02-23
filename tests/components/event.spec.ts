import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/events/event-1-for-e2e");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Event #1 for E2E' })).toBeVisible();
});

test("has a date", async ({ page }) => {
  await expect(page.getByText('Friday, December 5,')).toBeVisible();
});

test("has a time", async ({ page }) => {
  await expect(page.getByText('-6 pm EST')).toBeVisible();
});

test("has a location", async ({ page }) => {
  await expect(page.getByText('Hybrid')).toBeVisible();
});

test("has the event link", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Example External Event' })).toBeVisible();
});

test("has the add to calendar link", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Add to Calendar' })).toBeVisible();
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
