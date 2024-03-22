import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/accordion");
  await page.waitForLoadState("load");
});

test("if some accordions are open, ensure that the toggle button is set to Expand All", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  await expect(
    page.getByLabel("Section controls").getByRole("button"),
  ).toContainText("Expand All");
});

test("if all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  await page.getByRole("button", { name: "Accordion Item Heading 2" }).click();
  await expect(
    page.getByLabel("Section controls").getByRole("button"),
  ).toContainText("Collapse All");
});

test("first accordion title is displayed", async ({ page }) => {
  await expect(page.getByRole("main")).toContainText(
    "Accordion Item Heading 1",
  );
});

test("second accordion title is displayed", async ({ page }) => {
  await expect(page.getByRole("main")).toContainText(
    "Accordion Item Heading 2",
  );
});

test("first accordion content is displayed when expanded", async ({ page }) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  await expect(
    page.getByText(
      "Accordion content under heading 1. And let’s throw a link in here to an",
    ),
  ).toBeVisible();
});

test("second accordion content is displayed when expanded", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 2" }).click();
  await expect(
    page.getByText(
      "Accordion content under heading 2. And let’s throw a link in here to an",
    ),
  ).toBeVisible();
});

test("Expand All should open all accordions", async ({ page }) => {
  await page.getByRole("button", { name: "Expand All" }).click();
  await expect(
    page.getByText(
      "Accordion content under heading 1. And let’s throw a link in here to an",
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Accordion content under heading 2. And let’s throw a link in here to an",
    ),
  ).toBeVisible();
});

test("Collapse All should close all accordions", async ({ page }) => {
  await page.getByRole("button", { name: "Expand All" }).click();
  await page.getByRole("button", { name: "Collapse All" }).click();
  await expect(
    page.getByText(
      "Accordion content under heading 1. And let’s throw a link in here to an",
    ),
  ).not.toBeVisible();
  await expect(
    page.getByText(
      "Accordion content under heading 2. And let’s throw a link in here to an",
    ),
  ).not.toBeVisible();
});

test.skip("can tab to heading 1", async ({ page, isMobile }) => {
  if (isMobile) {
    await page.waitForTimeout(1000);
  }

  await pressTabKeyRepeatedly(page);

  await expect(
    page.getByRole("button", { name: "Accordion Item Heading 1" }),
  ).toBeFocused();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true });
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
