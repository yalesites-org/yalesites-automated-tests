import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "tiles");
});

test("has tiles", async ({ page }) => {
  await expect(page.locator('ul.tiles__wrap li')).toHaveCount(4);
});

test("card has a title", async ({ page }) => {
  await expect(page.getByText('Tile Cards', { exact: true })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();