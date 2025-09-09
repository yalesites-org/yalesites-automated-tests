import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/tiles");
  await page.waitForLoadState("load");
});

test("has tiles", async ({ page }) => {
  await expect(page.locator('ul.tiles__wrap li')).toHaveCount(4);
});

test("card has a title", async ({ page }) => {
  await expect(page.getByText('Tile Cards', { exact: true })).toBeVisible();
});

a11yTests();
visRegTests();