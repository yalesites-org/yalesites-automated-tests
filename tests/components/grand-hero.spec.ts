import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/grand-hero");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Grand Hero Heading' }).nth(1)).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
});

test("has a link", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Example Page' })).toBeVisible();
});

test("has a button", async ({ page }) => {
  await expect(page.getByRole('button', { name: /(Play|Pause) the Video/ }).nth(1)).toBeVisible();
});

a11yTests();
visRegTests();