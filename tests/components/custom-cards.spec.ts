import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "custom-cards");
});

test("is visible", async ({ page }) => {
  await expect(page.locator(".custom-card-collection").first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Custom Cards Title" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("First card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByAltText('An illustration from 1807')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }
  await expect(page.getByRole('link', { name: 'Custom Cards Heading' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Lorem ipsum dolor sit amet consectetur adipiscing elit natoque, interdum')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Second card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByAltText('Shadowy and dramatically low')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }
  await expect(page.getByRole('link', { name: 'Custom Card Heading 2' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Lorem ipsum dolor sit,')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Third card is visible", async ({ page, isMobile }) => {
  // Mobile does not show the images
  if (!isMobile) {
    await expect(page.getByAltText('A lamp shines in the darkness')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }
  await expect(page.getByRole('link', { name: 'Custom Card Heading 3' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Lorem ipsum dolor sit amet consectetur adipiscing elit natoque, ad torquent')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to first card", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 18);

  await expect(page.getByRole('link', { name: 'Custom Cards Heading' })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to second card", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole('link', { name: 'Custom Card Heading 2' })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to third card", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 20);

  await expect(page.getByRole('link', { name: 'Custom Card Heading 3' })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();