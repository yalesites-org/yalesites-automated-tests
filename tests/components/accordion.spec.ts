import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto("/component-pages-for-e2e-testing/accordion");
});

test.describe('with mouse', () => {
  test("should open and close", async ({ page }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");

    for (const item of accordionButtons) {
      await item.click();
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    for (const item of accordionButtons) {
      await item.click();
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("Expand All should open all accordions", async ({ page }) => {
    await toggleAllAccordions(page);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };
  });

  test("Collapse All should close all accordions", async ({ page }) => {
    // First open them all.
    await toggleAllAccordions(page);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    // Now close them all
    await toggleAllAccordions(page);
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("If some accordions are open, ensure that the toggle button is set to Expand All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    const firstAccordion = accordionButtons[0];
    await firstAccordion.click();
    const expandAllButton = await page.$(".accordion__toggle-all");
    expect(await expandAllButton?.innerText()).toBe("Expand All");
  });

  test("If all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      await item.click();
    };
    const collapseAllButton = await page.$(".accordion__toggle-all");
    expect(await collapseAllButton?.innerText()).toBe("Collapse All");
  });
});

test.describe('with keyboard', () => {
  test("should open and close", async ({ page }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");

    expect(accordionButtons).toBeTruthy();
    expect(accordionButtons.length).toBeGreaterThan(0);

    for (const item of accordionButtons) {
      await item.focus();
      await page.keyboard.press("Enter");
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    for (const item of accordionButtons) {
      await item.focus();
      await page.keyboard.press("Enter");
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("Expand All should open all accordions", async ({ page }) => {
    await toggleAllAccordions(page, "keyboard");
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };
  });

  test("Collapse All should close all accordions", async ({ page }) => {
    // First open them all.
    await toggleAllAccordions(page, "keyboard");
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("true");
    };

    // Now close them all
    await toggleAllAccordions(page, "keyboard");
    for (const item of accordionButtons) {
      expect(await item.getAttribute("aria-expanded")).toBe("false");
    };
  });

  test("If some accordions are open, ensure that the toggle button is set to Expand All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    const firstAccordion = accordionButtons[0];
    await firstAccordion.focus();
    await page.keyboard.press("Enter");
    const expandAllButton = await page.$(".accordion__toggle-all");
    expect(await expandAllButton?.innerText()).toBe("Expand All");
  });

  test("If all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
    page,
  }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");
    for (const item of accordionButtons) {
      await item.focus();
      await page.keyboard.press("Enter");
    };
    const collapseAllButton = await page.$(".accordion__toggle-all");
    expect(await collapseAllButton?.innerText()).toBe("Collapse All");
  });
});

test.describe('accessibility', () => {
  test("should pass axe", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

const toggleAllAccordions = async (page: Page, inputType = "mouse") => {
  const expandAllButton = await page.$(".accordion__toggle-all");

  if (inputType === "keyboard") {
    await expandAllButton?.focus();
    await page.keyboard.press("Enter");
    return;
  }

  await expandAllButton?.click();
};
