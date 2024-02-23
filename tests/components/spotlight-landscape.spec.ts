import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/spotlight-landscape");
  await page.waitForLoadState("load");
});

test("has the first spotlight", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Spotlight - Landscape Heading' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Olde English Bulldog sitting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spotlight - Landscape Heading' })).toBeVisible();
  await expect(page.getByText('Spotlight - Landscape Subheading')).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Example Page (link is external)', exact: true })).toBeVisible();
});

test("has the second spotlight", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Spotlight 2 Heading' })).toBeVisible();
  await expect(page.getByText('Spotlight 2 subheading')).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit example')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Towering shelves of books in' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Example Document (file' })).toBeVisible();
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
