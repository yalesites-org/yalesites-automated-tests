import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "gallery");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Gallery Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has three images as buttons", async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Aerial View of Yale' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Pathway on Yale campus' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has three icons to open the images larger", async ({ page }) => {
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('use').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('svg').nth(1)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.locator('ul').filter({ hasText: 'Open this image in a modal' }).locator('svg').nth(2)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("can select an image and see a larger version", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("can see the pagination to different images on a clicked element", async ({ page }) => {
  await page.getByRole('button', { name: 'Pathway on Yale campus' }).click();
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Close Gallery' }).click();
});

test("can see the navigation around an image that has been selected", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Next item' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Previous item' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Close Gallery' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("can see the image clicked on", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.locator('.media-grid-modal__content').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("can expand more info about the image", async ({ page }) => {
  await page.getByRole('button', { name: 'Aerial View of Yale' }).click();
  
  // Wait for modal to open completely
  await expect(page.getByLabel('Gallery Viewer')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  // Look for the expand button that has inline style (which makes it visible)
  const visibleExpandButton = page.locator('.media-grid-modal__toggle-caption--expand-content[style*="display: inline"]');
  
  // If we can't find one with inline style, try all expand buttons until one works
  const allExpandButtons = page.locator('.media-grid-modal__toggle-caption--expand-content');
  const count = await allExpandButtons.count();
  
  let clicked = false;
  for (let i = 0; i < count; i++) {
    try {
      const button = allExpandButtons.nth(i);
      if (await button.isVisible()) {
        await button.click();
        clicked = true;
        break;
      }
    } catch (e) {
      // Continue to next button if this one fails
    }
  }
  
  if (!clicked) {
    // Fallback: force click any expand button
    await allExpandButtons.first().click({ force: true });
  }
  
  // Wait and verify expansion worked by checking if modal content is expanded
  await page.waitForTimeout(1000);
  const modalContent = page.locator('.media-grid-modal__content[is-expanded="true"]');
  const expandedCount = await modalContent.count();
  expect(expandedCount).toBeGreaterThan(0);
});

test("can traverse the modal", async ({ page }) => {
  await page.getByRole('button', { name: 'Dark aisle between shelves of' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Aerial View of Yale University' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Next item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Pathway on Yale campus' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Aerial View of Yale University' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Previous item' }).click();
  await expect(page.getByLabel('Gallery Viewer').getByRole('img', { name: 'Dark aisle between shelves of' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await page.getByRole('button', { name: 'Close Gallery' }).click();
});

a11yTests();
visRegTests();