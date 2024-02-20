import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/component-pages-for-e2e-testing/gallery");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Gallery Title' })).toBeVisible();
});

test("has three images as buttons", async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Aerial View of Yale' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pathway on Yale campus' })).toBeVisible();
});

test("has three icons to open the images larger", async ({ page }) => {
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('use').first()).toBeVisible();
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('svg').nth(1)).toBeVisible();
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('svg').nth(2)).toBeVisible();
});

test("can select an image and see a larger version", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
});

test("can see the pagination to different images on a clicked element", async ({ page }) => {
  await page.getByRole('button', { name: 'Pathway on Yale campus' }).click();
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible();
  await page.getByRole('button', { name: 'Close Gallery' }).click();
});

test("can see the navigation around an image that has been selected", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next item' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Previous item' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close Gallery' })).toBeVisible();
});

test("can see the image clicked on", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await expect(page.locator('.media-grid-modal__content').first()).toBeVisible();
});

test("can expand more info about the image", async ({ page }) => {
  await page.getByRole('button', { name: 'Aerial View of Yale' }).click();
  // Why are there two here?
  await page.getByRole('button', { name: 'expand' }).nth(1).click();
  await expect(page.getByText('Lorem ipsum dolor sit amet').nth(1)).toBeVisible();
});

test("can traverse the modal", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Aerial View of Yale University' })).toBeVisible();
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible();
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Aerial View of Yale University' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible();
  await page.getByRole('button', { name: 'Close Gallery' }).click();
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
