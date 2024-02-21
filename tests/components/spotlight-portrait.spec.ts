import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/spotlight-portrait");
  await page.waitForLoadState("load");
});

test("has the first spotlight", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Spotlight - Portrait Heading' }).nth(3)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Olde English Bulldog sitting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spotlight - Portrait Heading' })).toBeVisible();
  await expect(page.getByText('Spotlight - Portrait Subheading')).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Example Page', exact: true })).toBeVisible();

});

test("has the second spotlight", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Spotlight - Portrait 2 Heading Spotlight - Portrait 2 Subheading Lorem ipsum' }).nth(2)).toBeVisible();
  await expect(page.getByRole('img', { name: 'A lion-headed gargoyle' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spotlight - Portrait 2 Heading' })).toBeVisible();
  await expect(page.getByText('Spotlight - Portrait 2 Subheading')).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet').nth(1)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Example Word Document' })).toBeVisible();
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
