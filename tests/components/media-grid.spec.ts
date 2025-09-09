import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/media-grid");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Media Grid Title' })).toBeVisible();
});

test("has four images", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).nth(1)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Towering shelves of books in' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Two wooden chairs in an aisle' })).toBeVisible();
});

a11yTests();
visRegTests();