import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/quick-links");
  await page.waitForLoadState("load");
});

test("has a background image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Dramatic view of the towers' })).toBeVisible();
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quick Links Title' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible();
});

test("has a list of links", async ({ page }) => {
  // We are getting them in the ul context since there are menus with the same
  // name
  const ul = page.locator('ul.quick-links__links');

  await expect(ul.getByRole('link', { name: 'Accordion' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Example Document' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Callout' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Custom Cards' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'PDF' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Example Page' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Calendar List' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Spotlight - Landscape' })).toBeVisible();
  await expect(ul.getByRole('link', { name: 'Google' })).toBeVisible();
});

a11yTests();
visRegTests();