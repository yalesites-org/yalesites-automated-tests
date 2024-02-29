import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction }from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/custom-cards");
  await page.waitForLoadState("load");
});

test("is visible", async ({ page }) => {
  await expect(page.locator(".custom-card-collection").first()).toBeVisible();
});

test("Heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Custom Cards Title" }),
  ).toBeVisible();
});

test("First card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByRole('img', { name: 'An illustration from 1807' })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Custom Cards Heading' })).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet consectetur adipiscing elit natoque, interdum')).toBeVisible();
});

test("Second card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByRole('img', { name: 'Shadowy and dramatically low' })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Custom Card Heading 2' })).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit,')).toBeVisible();
});

test("Third card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByRole('img', { name: 'A lamp shines in the darkness' })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Custom Card Heading 3' })).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet consectetur adipiscing elit natoque, ad torquent')).toBeVisible();
});

test("can use keyboard to tab to first card", async ({ page }) => {
  test.skip("To be fixed once animation menu is addressed: YSP-352");

  await pressTabKeyRepeatedly(page, 18);

  await expect(page.getByRole('link', { name: 'Custom Cards Heading' })).toBeFocused();
});

test("can use keyboard to tab to second card", async ({ page }) => {
  test.skip("To be fixed once animation menu is addressed: YSP-352");
  
  await pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole('link', { name: 'Custom Card Heading 2' })).toBeFocused();
});

test("can use keyboard to tab to third card", async ({ page }) => {
  test.skip("To be fixed once animation menu is addressed: YSP-352");

  await pressTabKeyRepeatedly(page, 20);

  await expect(page.getByRole('link', { name: 'Custom Card Heading 3' })).toBeFocused();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.17 });
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
