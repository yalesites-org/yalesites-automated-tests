import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from '@axe-core/playwright';

type InputType = "mouse" | "keyboard";

test.beforeEach(async ({ page }) => {
  await page.goto("/component-pages-for-e2e-testing/accordion");
});

const tests = (inputType: InputType) => {
  test("should open and close", async ({ page }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");

    for (const item of accordionButtons) {
      await selectElement(page, item, inputType);
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    for (const item of accordionButtons) {
      await selectElement(page, item, inputType);
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("Expand All should open all accordions", async ({ page }) => {
    await toggleAllAccordions(page, inputType);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };
  });

  test("Collapse All should close all accordions", async ({ page }) => {
    // First open them all.
    await toggleAllAccordions(page, inputType);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    // Now close them all
    await toggleAllAccordions(page, inputType);
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("If some accordions are open, ensure that the toggle button is set to Expand All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    const firstAccordion = accordionButtons[0];
    await selectElement(page, firstAccordion, inputType);
    const expandAllButton = await page.$(".accordion__toggle-all");
    expect(await expandAllButton?.innerText()).toBe("Expand All");
  });

  test("If all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      await selectElement(page, item, inputType);
    };
    const collapseAllButton = await page.$(".accordion__toggle-all");
    expect(await collapseAllButton?.innerText()).toBe("Collapse All");
  });
}

test.describe('with mouse', () => {
  tests("mouse");
});

test.describe('with keyboard', () => {
  tests("keyboard");
});

test.describe('accessibility', () => {
  test("should pass axe", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

const toggleAllAccordions = async (page: Page, inputType: InputType): Promise<void> => {
  const expandAllButton = await page.$(".accordion__toggle-all");

  await selectElement(page, expandAllButton, inputType);
};

const selectElement = async (page: Page, element, inputType: InputType): Promise<void> => {
  expect(inputType).toMatch(/mouse|keyboard/);

  if (inputType === "keyboard") {
    await element?.focus();
    await page.keyboard.press("Enter");
    return;
  }

  await element?.click();
};