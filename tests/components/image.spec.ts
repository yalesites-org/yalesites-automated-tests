import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/component-pages-for-e2e-testing/image");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Image' })).toBeVisible();
});

test("has an image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Olde English Bulldog sitting' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
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
