import { expect, test } from "@playwright/test";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

test.beforeEach(async ({ page }) => {
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
  await expect(page.getByRole("paragraph")).toBeVisible();
});

test("second accordion content is displayed when expanded", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 2" }).click();
  await expect(page.getByRole("main")).toBeVisible();
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

visRegTests();

a11yTests();
