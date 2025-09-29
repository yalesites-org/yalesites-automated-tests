import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "quote-callout");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quote Callout' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('This is a test')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has an attribution", async ({ page }) => {
  await expect(page.getByText('Someone')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();