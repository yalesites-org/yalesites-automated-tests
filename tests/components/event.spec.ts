import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/events/event-1-for-e2e");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Event #1 for E2E' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a date", async ({ page }) => {
  await expect(page.getByText('Fri Dec 5, 2036').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a time", async ({ page }) => {
  await expect(page.getByText('5:00 p.m.—6:00 p.m.').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has event details section", async ({ page }) => {
  await expect(page.locator('.event-meta__details-wrapper')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has the event link", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Example External Event' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has the add to calendar link", async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Add to Calendar' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();