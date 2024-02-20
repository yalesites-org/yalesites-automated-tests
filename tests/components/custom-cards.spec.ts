import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
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
  await expect(page.getByRole('link', { name: 'Custom Cards Heading (link is' })).toBeVisible();
  await expect(page.getByText('Lorem ipsum dolor sit amet consectetur adipiscing elit natoque, interdum')).toBeVisible();
});

test("Second card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByRole('img', { name: 'Shadowy and dramatically low' })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Custom Card Heading 2 (file' })).toBeVisible();
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

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
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
