import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/component-pages-for-e2e-testing/action-banner");
  await page.waitForLoadState("load");
});

test("should display heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Call to Action Banner" }),
  ).toBeVisible();
});

test("should display link", async ({ page }) => {
  await expect(page.getByRole("link", { name: "External page" })).toBeVisible();
});

test("should display content", async ({ page }) => {
  await expect(page.getByText("Banner content goes in here.")).toBeVisible();
});

test("should display background image", async ({ page }) => {
  await expect(
    page.getByRole("img", { name: "Two wooden chairs in an aisle" }),
  ).toBeVisible();
});

test("can use keyboard to tab to External page link", async ({ page }) => {
  // Note: This will fail on firefox and mobile safari due to incorrect tabbing
  for (let i = 0; i < 19; i++) {
    await page.keyboard.press(tabKey);
  }

  await expect(page.getByRole("link", { name: "External page" })).toBeFocused();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
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
