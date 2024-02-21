import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/post-feed");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Post Feed Heading' })).toBeVisible();
});

test("has a post category label and select", async ({ page }) => {
  await expect(page.getByText('Post Category')).toBeVisible();
  await expect(page.getByLabel('Post Category')).toBeVisible();
});

test("has a button to apply the category filter", async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
});

test("has a list of two posts", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Exterior of the Beinecke' })).toBeVisible();
  await expect(page.getByText('January 31,')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Is Drupal Worth It?' })).toBeVisible();
  await expect(page.locator('li').filter({ hasText: 'May 24, 2023 Longform article' }).getByRole('time')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Longform article' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Red, yellow, and white' })).toBeVisible();
  await expect(page.locator('li').filter({ hasText: 'May 24, 2023 Article with' }).getByRole('time')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Article with mostly text' })).toBeVisible();
});

test("can filter the posts by category", async ({ page }) => {
  await page.getByLabel('Post Category').selectOption('27');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByLabel('Post Category')).toBeVisible();
  await expect(page.getByLabel('Post Category')).toHaveValue('27');
  await expect(page.getByRole('img', { name: 'Exterior of the Beinecke' })).toBeVisible();
  await expect(page.getByText('January 31,')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Is Drupal Worth It?' })).toBeVisible();

  await expect(page.getByRole('link', { name: 'Longform article' })).not.toBeVisible();
  await expect(page.getByRole('img', { name: 'Red, yellow, and white' })).not.toBeVisible();
  await expect(page.locator('li').filter({ hasText: 'May 24, 2023 Article with' }).getByRole('time')).not.toBeVisible();
  await expect(page.getByRole('link', { name: 'Article with mostly text' })).not.toBeVisible();
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
