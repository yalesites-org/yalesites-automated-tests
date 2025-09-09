import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/view");
  await page.waitForLoadState("load");
});

test("has a heading for the view", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'View Heading' })).toBeVisible();
});

test("has the first event", async ({ page }) => {
  await expect(page.getByAltText('Michael Vaughn wearing a')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dinner with Dad' })).toBeVisible();
  await expect(page.getByText('TUE MAY 5,')).toBeVisible();
  await expect(page.getByText('This is some teaser text')).toBeVisible();
});

test("has the second event", async ({ page }) => {
  await expect(page.getByAltText('Two wooden chairs in an aisle')).toBeVisible();
  await expect(page.getByRole('link', { name: 'MichaelCON' })).toBeVisible();
  await expect(page.getByText('THU JUL 3,')).toBeVisible();
});

a11yTests();
visRegTests();