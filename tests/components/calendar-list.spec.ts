import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/calendar-list");
  await page.waitForLoadState("load");
});

test("should have a heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Calendar List Heading" }),
  ).toBeVisible();
});

test("should have an event category drop down with button", async ({
  page,
}) => {
  await expect(page.getByLabel("Event Category")).toBeVisible();
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
});

test("should have a list of events", async ({ page }) => {
  await expect(
    page.locator("li").filter({ hasText: "In-person Office Hours with" }),
  ).toBeVisible();
  await expect(page.getByText("In-person")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Office Hours with Mike" }),
  ).toBeVisible();
  await expect(page.getByText("Wednesday, February 14,")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Two wooden chairs in an aisle" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "MichaelCON" })).toBeVisible();
  await expect(page.getByText("Thursday, July 3,")).toBeVisible();
  await expect(
    page.locator("li").filter({ hasText: "MichaelCON Thursday, July 3," }),
  ).toBeVisible();
  await expect(
    page.locator("li").filter({ hasText: "Hybrid Event #1 for E2E" }),
  ).toBeVisible();
  await expect(page.getByText("Hybrid")).toBeVisible();
  await expect(
    page.locator("li").filter({ hasText: "Dinner with Dad Tuesday, May" }),
  ).toBeVisible();
});

test("can use keyboard to tab to Event Category drop down", async ({ page }) => {
  pressTabKeyRepeatedly(page, 18);
  await expect(page.getByLabel("Event Category")).toBeFocused();
});

test("can use keyboard to tab to Apply button", async ({ page }) => {
  pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole("button", { name: "Apply" })).toBeFocused();
});

test("can use keyboard to tab to In-person Office Hours with Mike link", async ({ page }) => {
  pressTabKeyRepeatedly(page, 20);
  await expect(page.getByRole("link", { name: "Office Hours with Mike" })).toBeFocused();
});

test("can use keyboard to select Staff from the drop down and apply", async ({ page }) => {
  pressTabKeyRepeatedly(page, 18);

  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("link", { name: "Event #1 for E2E" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Office Hours with Mike" })).not.toBeVisible();
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
