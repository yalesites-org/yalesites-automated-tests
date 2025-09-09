import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/image");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Image' })).toBeVisible();
});

test("has an image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Olde English Bulldog sitting' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
});

a11yTests();
visRegTests();