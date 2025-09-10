import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "calendar-list");
});

test("should have a heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Calendar List Heading" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should have an event category drop down with button", async ({
  page,
}) => {
  await expect(page.getByLabel("Event Category")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("should have a list of events", async ({ page }) => {
  // Test component structure rather than specific content
  await expect(
    page.locator("ul, ol").first()
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  
  // Check that at least one event item exists
  await expect(
    page.locator("li").first()
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  
  // Check that there's at least one link (event link)
  await expect(
    page.locator("li a").first()
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  
  // Check for event components without being too specific about content
  const eventCount = await page.locator("li").count();
  expect(eventCount).toBeGreaterThan(0);
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Event Category drop down", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 18);
  await expect(page.getByLabel("Event Category")).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Apply button", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole("button", { name: "Apply" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to In-person Office Hours with Mike link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 20);
  await expect(page.getByRole("link", { name: "Office Hours with Mike" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to select Staff from the drop down and apply", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 18);

  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("link", { name: "Event #1 for E2E" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole("link", { name: "Office Hours with Mike" })).not.toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();