import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "accordion");
});

test("if some accordions are open, ensure that the toggle button is set to Expand All", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  await expect(
    page.getByLabel("Section controls").getByRole("button", { name: /Expand All/i }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("if all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  await page.getByRole("button", { name: "Accordion Item Heading 2" }).click();
  await expect(
    page.getByLabel("Section controls").getByRole("button", { name: /Collapse All/i }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("first accordion title is displayed", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Accordion Item Heading 1" })
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("second accordion title is displayed", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Accordion Item Heading 2" })
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("first accordion content is displayed when expanded", async ({ page }) => {
  await page.getByRole("button", { name: "Accordion Item Heading 1" }).click();
  
  // Wait for accordion animation to complete
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  await expect(
    page.getByText("Accordion content under heading 1", { exact: false }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("second accordion content is displayed when expanded", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Accordion Item Heading 2" }).click();
  
  // Wait for accordion animation to complete
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  await expect(
    page.getByText("Accordion content under heading 2", { exact: false }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Expand All should open all accordions", async ({ page }) => {
  await page.getByRole("button", { name: "Expand All" }).click();
  
  // Wait for accordion animation to complete
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  await expect(
    page.getByText("Accordion content under heading 1", { exact: false }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(
    page.getByText("Accordion content under heading 2", { exact: false }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("Collapse All should close all accordions", async ({ page }) => {
  await page.getByRole("button", { name: "Expand All" }).click();
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  await page.getByRole("button", { name: "Collapse All" }).click();
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
  
  await expect(
    page.getByText("Accordion content under heading 1", { exact: false }),
  ).not.toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(
    page.getByText("Accordion content under heading 2", { exact: false }),
  ).not.toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test.skip("can tab to heading 1", async ({ page, isMobile }) => {
  // TODO: Keyboard navigation tests need investigation
  // The pressTabKeyRepeatedly function tab counts may not match current page structure
  // This test was originally skipped and needs proper debugging
  
  if (isMobile) {
    await page.waitForTimeout(1000);
  }

  await pressTabKeyRepeatedly(page);

  await expect(
    page.getByRole("button", { name: "Accordion Item Heading 1" }),
  ).toBeFocused({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();