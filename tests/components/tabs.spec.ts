import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
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

a11yTests();
visRegTests();