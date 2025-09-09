import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
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
  // Using nth(1) because there are two expand buttons: one in the gallery and one in the modal
  // We need the modal's expand button which is the second one
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

a11yTests();
visRegTests();