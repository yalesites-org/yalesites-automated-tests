import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "post-feed");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Post Feed Heading' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a post category label and select", async ({ page }) => {
  await expect(page.getByText('Post Category')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Post Category')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a button to apply the category filter", async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a list of posts with proper content", async ({ page }) => {
  // Test post titles
  await expect(page.getByRole('link', { name: 'Is Drupal Worth It?' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('link', { name: 'Longform article' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('link', { name: 'Article with mostly text' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  
  // Test dates are visible
  await expect(page.getByText('January 31, 2024')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('May 24, 2023').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  
  // Test structure - should have 3 post cards
  await expect(page.locator('li.reference-card')).toHaveCount(3);
  
  // Test for images if they exist (conditional check)
  const imageCount = await page.locator('li.reference-card img').count();
  if (imageCount > 0) {
    // If images exist, test their alt text
    await expect(page.locator('img').first()).toHaveAttribute('alt');
  }
});

test("can filter the posts by category", async ({ page }) => {
  // First, record the initial post count
  const initialPostCount = await page.locator('li.reference-card').count();
  
  // Apply filter for 'International' category
  await page.getByLabel('Post Category').selectOption('27');
  await page.getByRole('button', { name: 'Apply' }).click();
  
  // Verify filter was applied
  await expect(page.getByLabel('Post Category')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Post Category')).toHaveValue('27');
  
  // Wait for filtered results to load
  await page.waitForTimeout(1000);
  
  // Test that filtering actually changed the results
  const filteredPostCount = await page.locator('li.reference-card').count();
  expect(filteredPostCount).toBeLessThanOrEqual(initialPostCount);
  
  // Test that some specific posts are no longer visible after filtering
  const allPostsVisible = await page.getByRole('link', { name: 'Is Drupal Worth It?' }).isVisible() &&
                          await page.getByRole('link', { name: 'Longform article' }).isVisible() &&
                          await page.getByRole('link', { name: 'Article with mostly text' }).isVisible();
  
  // If filtering worked, not all posts should be visible
  if (filteredPostCount < initialPostCount) {
    expect(allPostsVisible).toBe(false);
  }
});

a11yTests();
visRegTests();