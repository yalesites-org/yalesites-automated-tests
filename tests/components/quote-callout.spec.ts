import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/quote-callout");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quote Callout' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('This is a test')).toBeVisible();
});

test("has an attribution", async ({ page }) => {
  await expect(page.getByText('Someone')).toBeVisible();
});

a11yTests();
visRegTests();