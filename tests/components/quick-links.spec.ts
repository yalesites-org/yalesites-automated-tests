import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/quick-links");
  await page.waitForLoadState("load");
});

test("has a background image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Dramatic view of the towers' })).toBeVisible();
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quick Links Title' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
});

test("has a list of links", async ({ page }) => {
  // We are getting them in the ul context since there are menus with the same
  // name
  const ul = page.locator('ul.quick-links__links');

  await expect(ul.getByRole('link', { name: 'Accordion' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Example Document (file' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Callout' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Custom Cards' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'PDF (file download)' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Example Page (link is' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Calendar List' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Spotlight - Landscape' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Google (link is external)' })).toBeVisible();
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
