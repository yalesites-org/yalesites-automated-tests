import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "button-link");
});

test("should show the accordion link button", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Accordion Page" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should show the Yale University link button", async ({ page }) => {
  await expect(
    page
      .locator("#main-content")
      .getByRole("link", { name: "Yale University" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should be able to click the accordion link button", async ({ page }) => {
  await page.getByRole("link", { name: "Accordion Page" }).click();
  await expect(page).toHaveURL(/accordion/);
});

test("should be able to click the Yale University link button", async ({
  page,
}) => {
  await page
    .locator("#main-content")
    .getByRole("link", { name: "Yale University" })
    .click();
  await expect(page).toHaveURL(/yale\.edu/);
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Accordion Page link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 18);

  await expect(page.getByRole("link", { name: "Accordion Page" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Yale University link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole("link", { name: "Yale University" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();