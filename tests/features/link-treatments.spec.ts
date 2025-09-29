import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/");
  await page.waitForLoadState("load");
});

test("should have link treatment text throughout the page", async ({ page, isMobile }) => {
  await expect(page.getByRole('link', { name: 'Yale Merchandise' })).toContainText(/(link is external)/i);
  if (!isMobile) {
    await expect(page.getByRole('link', { name: 'Subscribe' })).toContainText(/(link is external)/i);
  }
  await expect(page.getByRole('link', { name: 'an external link' })).toContainText(/(link is external)/i);
  await expect(page.getByRole('link', { name: 'Modern Report' })).toContainText(/(link downloads file)/i);
  await expect(page.getByRole('link', { name: 'Jester' })).toContainText(/(link is external)/i);
});

test("should have link treatment icons throughout the page", async ({ page, isMobile }) => {
  await expect(page.getByRole('link', { name: 'Yale Merchandise' }).locator('.fa-arrow-up-right')).toBeVisible();
  if (!isMobile) {
    await expect(page.getByRole('link', { name: 'Subscribe' }).locator('.fa-arrow-up-right')).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'an external link' }).locator('.fa-arrow-up-right')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Modern Report' }).locator('.fa-circle-down')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jester' }).locator('.fa-arrow-up-right')).toBeVisible();
});
