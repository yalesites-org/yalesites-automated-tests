import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/facts-and-figures");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.locator('h2').filter({ hasText: 'Facts and Figures' })).toBeVisible();
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Perfect for highlighting stats and concise content. Customize with background colors or photos to enhance the overall impact to make your content stand out beautifully and effectively!')).toBeVisible();
});

test("has fact 1: Dogs and bees can smell fear", async ({ page }) => {
  await expect(page.getByText('Dogs and bees can smell fear')).toBeVisible();
  await expect(page.getByText('This is the first fact')).toBeVisible();
});

test("has fact 2: The human head weighs 8 pounds", async ({ page }) => {
  await expect(page.getByText('The human head weighs 8 pounds')).toBeVisible();
  await expect(page.getByText('This is the second fact')).toBeVisible();
});

test("has fact 3: YaleSites is awesome", async ({ page }) => {
  await expect(page.getByText('YaleSites is awesome')).toBeVisible();
  await expect(page.getByText('This is a 3rd fact')).toBeVisible();
});

test("has fact 4: You are awesome, too", async ({ page }) => {
  await expect(page.getByText('You are awesome, too')).toBeVisible();
  await expect(page.getByText('This is the fourth fact')).toBeVisible();
});

test("should pass axe", async ({ page }) => {
  const axe_tags = [
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "best-practice",
  ];
  await expect(page).toPassAxe({ tags: axe_tags });
});

