import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "spotlight-portrait");
});

test("has the first spotlight", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Spotlight - Portrait Heading' }).nth(3)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'Olde English Bulldog sitting' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('heading', { name: 'Spotlight - Portrait Heading' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Spotlight - Portrait Subheading')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Lorem ipsum dolor sit amet').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('link', { name: 'Example Page (link is external)', exact: true })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

});

test("has the second spotlight", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Spotlight - Portrait 2 Heading Spotlight - Portrait 2 Subheading Lorem ipsum' }).nth(2)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'A lion-headed gargoyle' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('heading', { name: 'Spotlight - Portrait 2 Heading' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Spotlight - Portrait 2 Subheading')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Lorem ipsum dolor sit amet').nth(1)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('link', { name: 'Example Word Document' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();