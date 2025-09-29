import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "embed");
});

test("has an iframe", async ({ page }) => {
  await page.waitForTimeout(500);
  await expect(page.locator('iframe[title="X Post"]')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();