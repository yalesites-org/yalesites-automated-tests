import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "media-grid");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Media Grid Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has four images", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'Aerial View of Yale University' }).nth(1)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'Towering shelves of books in' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'Two wooden chairs in an aisle' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();