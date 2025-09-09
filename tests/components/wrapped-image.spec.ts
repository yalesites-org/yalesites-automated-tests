import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/wrapped-image");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Wrapped Image' })).toBeVisible();
});

test("has an image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Looking down on a spiral' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('sit example doc')).toBeVisible();
  await expect(page.getByText('consectetur adipiscing elit, habitasse')).toBeVisible();
  await expect(page.getByText('Mauris praesent himenaeos')).toBeVisible();
});

a11yTests();
visRegTests();