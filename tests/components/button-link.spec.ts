import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/component-pages-for-e2e-testing/button-link");
  await page.waitForLoadState("load");
});

test("should show the accordion link button", async ({ page }) => {
  await expect(
    page.getByRole("link", { name: "Accordion Page" }),
  ).toBeVisible();
});

test("should show the Yale University link button", async ({ page }) => {
  await expect(
    page
      .locator("#main-content")
      .getByRole("link", { name: "Yale University" }),
  ).toBeVisible();
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