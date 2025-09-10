import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "quick-links");
});

test("has a background image", async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Dramatic view of the towers' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Quick Links Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem ipsum dolor sit amet')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a list of links", async ({ page }) => {
  // We are getting them in the ul context since there are menus with the same
  // name
  const ul = page.locator('ul.quick-links__links');

  await expect(ul.getByRole('link', { name: 'Accordion' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Example Document' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Callout' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Custom Cards' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'PDF' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Example Page' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Calendar List' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Spotlight - Landscape' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(ul.getByRole('link', { name: 'Google' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();