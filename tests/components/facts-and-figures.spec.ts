import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "facts-and-figures");
});

test("has a heading", async ({ page }) => {
  await expect(page.locator('h2').filter({ hasText: 'Facts and Figures' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Perfect for highlighting stats and concise content. Customize with background colors or photos to enhance the overall impact to make your content stand out beautifully and effectively!')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has fact 1: Dogs and bees can smell fear", async ({ page }) => {
  await expect(page.getByText('Dogs and bees can smell fear')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('This is the first fact')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has fact 2: The human head weighs 8 pounds", async ({ page }) => {
  await expect(page.getByText('The human head weighs 8 pounds')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('This is the second fact')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has fact 3: YaleSites is awesome", async ({ page }) => {
  await expect(page.getByText('YaleSites is awesome')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('This is a 3rd fact')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has fact 4: You are awesome, too", async ({ page }) => {
  await expect(page.getByText('You are awesome, too')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('This is the fourth fact')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();