import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/callout");
  await page.waitForLoadState("load");
});

test("is visible", async ({ page }) => {
  await expect(page.locator(".callout").first()).toBeVisible();
});

test("First heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout Heading" }),
  ).toBeVisible();
});

test("First callout content is visible", async ({ page }) => {
  await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible();
});

test("First callout link is visible", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Accordion Page" }),
  ).toBeVisible();
});

test("Second callout is visible", async ({ page }) => {
  await expect(
    page.locator(".callouts__inner > div:nth-child(2)"),
  ).toBeVisible();
});

test("Second heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout 2 Heading" }),
  ).toBeVisible();
});

test("Second callout content is visible", async ({ page }) => {
  await expect(page.getByText("More glorious content for you")).toBeVisible();
});

test("Second callout link is visible", async ({ page }) => {
  await expect(page.getByRole("link", { name: "External Page" })).toBeVisible();
});

test("Third callout is visible", async ({ page }) => {
  await expect(page.getByText("Callout 3 Heading Wouldn’t")).toBeVisible();
});

test("Third callout heading is visible", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Callout 3 Heading" }),
  ).toBeVisible();
});

test("Third callout content is visible", async ({ page }) => {
  await expect(page.getByText("Wouldn’t you like to download")).toBeVisible();
});

test("Third callout link is visible", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Example Document" }),
  ).toBeVisible();
});

test.skip("can use keyboard to tab to Accordion Page link", async ({ page }) => {
  pressTabKeyRepeatedly(page, 18);

  await expect(page.getByRole("link", { name: "Accordion Page" })).toBeFocused();
});

test.skip("can use keyboard to tab to External Page link", async ({ page }) => {
  pressTabKeyRepeatedly(page, 19);

  await expect(page.getByRole("link", { name: "External Page" })).toBeFocused();
});

test.skip("can use keyboard to tab to Example Document link", async ({ page }) => {
  pressTabKeyRepeatedly(page, 20);

  await expect(page.getByRole("link", { name: "Example Document" })).toBeFocused();
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
