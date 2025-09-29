import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "callout");
});

test("is visible", async ({ page }) => {
  await expect(page.locator(".callout").first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("First heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout Heading" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("First callout content is visible", async ({ page }) => {
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("First callout link is visible", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Accordion Page" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Second callout is visible", async ({ page }) => {
  await expect(
    page.locator(".callouts__inner > div:nth-child(2)"),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Second heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout 2 Heading" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Second callout content is visible", async ({ page }) => {
  await expect(page.getByText("More glorious content for you")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Second callout link is visible", async ({ page }) => {
  await expect(page.getByRole("link", { name: "External Page" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Third callout is visible", async ({ page }) => {
  await expect(page.getByText("Callout 3 Heading", { exact: false })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Third callout heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout 3 Heading" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Third callout content is visible", async ({ page }) => {
  await expect(page.locator('p:has-text("download")')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Third callout link is visible", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Example Document" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Accordion Page link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 18);

  await expect(page.getByRole("link", { name: "Accordion Page" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to External Page link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole("link", { name: "External Page" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

// TODO: Keyboard navigation tests are unreliable due to browser differences in focus behavior
// and dynamic page structure affecting tab order. Needs investigation of alternative approach.
test.skip("can use keyboard to tab to Example Document link", async ({ page }) => {
  await pressTabKeyRepeatedly(page, 20);

  await expect(page.getByRole("link", { name: "Example Document" })).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();