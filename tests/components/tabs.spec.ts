import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/component-pages-for-e2e-testing/tabs");
  await page.waitForLoadState("load");
});

test("has tab 1", async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Tab Heading', exact: true })).toBeVisible();
});

test("has tab 2", async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Tab Heading 2' })).toBeVisible();
});

test("has tab 3", async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Tab Heading 3' })).toBeVisible();
});

test("has tab 4", async ({ page }) => {
  await expect(page.getByRole('tab', { name: 'Tab Heading 4' })).toBeVisible();
});

test("can traverse each tab panel", async ({ page }) => {
  const tabContent = page.locator("div.tabs__content");
  await expect(tabContent).toHaveCount(4);

  await expect(tabContent.first()).toBeVisible();
  await page.getByRole('tab', { name: 'Tab Heading 2' }).click();
  await expect(tabContent.nth(1)).toBeVisible();
  await page.getByRole('tab', { name: 'Tab Heading 3' }).click();
  await expect(tabContent.nth(2)).toBeVisible();
  await page.getByRole('tab', { name: 'Tab Heading 4' }).click();
  await expect(tabContent.nth(3)).toBeVisible();
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
