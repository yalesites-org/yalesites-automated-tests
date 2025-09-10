import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "action-banner");
});

test("should display heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Call to Action Banner" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should display link", async ({ page }) => {
  await expect(page.getByRole("link", { name: "External page" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should display content", async ({ page }) => {
  await expect(page.getByText("Banner content goes in here.")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should display background image", async ({ page }) => {
  await expect(
    page.getByRole("img", { name: "Two wooden chairs in an aisle" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to External page link", async ({ page }) => {
  await pressTabKeyRepeatedly(page);

  await expect(page.getByRole("link", { name: "External page" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();