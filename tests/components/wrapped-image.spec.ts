import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "wrapped-image");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Wrapped Image' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has an image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Looking down on a spiral' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('sit example doc')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('consectetur adipiscing elit, habitasse')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Mauris praesent himenaeos')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();