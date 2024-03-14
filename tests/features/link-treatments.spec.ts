import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/");
  await page.waitForLoadState("load");
});

test("should have link treatment text throughout the page", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Yale Merchandise' })).toContainText('(link is external)');
  await expect(page.getByRole('link', { name: 'Subscribe' })).toContainText('(link is external)');
  await expect(page.getByRole('link', { name: 'an external link' })).toContainText('(link is external)');
  await expect(page.getByRole('link', { name: 'Modern Report' })).toContainText('(file download)');
  await expect(page.getByRole('link', { name: 'Modern Report' })).toContainText('(PDF)');
  await expect(page.getByRole('link', { name: 'Jester' })).toContainText('(link is external)');
});

test("should have link treatment icons throughout the page", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Yale Merchandise' }).locator('i.fa-icon.fa-arrow-up-right')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Subscribe' }).locator('i.fa-icon.fa-arrow-up-right')).toBeVisible();
  await expect(page.getByRole('link', { name: 'an external link' }).locator('i.fa-icon.fa-arrow-up-right')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Modern Report' }).locator('i.fa-icon.fa-circle-down')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Jester' }).locator('i.fa-icon.fa-arrow-up-right')).toBeVisible();
});
