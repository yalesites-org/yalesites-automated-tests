import { expect, test, type Page, ElementHandle } from "@playwright/test";
import { selectElement, type InputType } from "support/a11ySelectElement";
import a11yTests from "support/a11yTests";
import visRegTests from "@support/visRegTests";
import tabKeyForBrowser from "support/tabKey";

const toggleExpandCollapseAll = async (
  page: Page,
  inputType: InputType,
): Promise<void> => {
  const expandAllButton = await page.$(".accordion__toggle-all");

  await selectElement(page, expandAllButton, inputType);
};

const toggleAccordionsIndividually = async (
  page: Page,
  accordionButtons: ElementHandle<SVGElement | HTMLElement>[],
  inputType: InputType,
): Promise<void> => {
  for (const item of accordionButtons) {
    await selectElement(page, item, inputType);
  }
}

const checkAccordionState = async (accordionButtons, expectedState) => {
  for (const item of accordionButtons) {
    expect(await item.getAttribute("aria-expanded")).toBe(expectedState);
  }
}

let tabKey: string;
test.beforeEach(async ({ page, defaultBrowserType }) => {
  // Webkit uses Alt+Tab over Tab to traverse, so we capture this before a test is done.
  tabKey = tabKeyForBrowser(defaultBrowserType);
  await page.goto("/component-pages-for-e2e-testing/accordion");
  await page.waitForLoadState("domcontentloaded");
  page.locator("body");
});

const tests = (inputType: InputType) => {
  test("should open and close", async ({ page }) => {
    const accordionButtons = await page.$$(".accordion-item__toggle");

    await toggleAccordionsIndividually(page, accordionButtons, inputType);
    await checkAccordionState(accordionButtons, "true");

    await toggleAccordionsIndividually(page, accordionButtons, inputType);
    await checkAccordionState(accordionButtons, "false");
  });

  test("Expand All should open all accordions", async ({ page }) => {
    await toggleExpandCollapseAll(page, inputType);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    await checkAccordionState(accordionButtons, "true");
  });

  test("Collapse All should close all accordions", async ({ page }) => {
    // First open them all.
    await toggleExpandCollapseAll(page, inputType);
    const accordionButtons = await page.$$(".accordion-item__toggle");
    await checkAccordionState(accordionButtons, "true");

    // Now close them all
    await toggleExpandCollapseAll(page, inputType);
    await checkAccordionState(accordionButtons, "false");
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
    }
    const collapseAllButton = await page.$(".accordion__toggle-all");

    expect(await collapseAllButton?.innerText()).toBe("Collapse All");
  });

  test("First accordion title is displayed", async ({ page }) => {
    const firstAccordionTitle = await page.$(".accordion-item__heading");
    expect(firstAccordionTitle).not.toBeNull();
  });

  test("First accordion content is displayed when expanded", async ({ page }) => {
    const firstAccordion = page.locator(".accordion-item").first();
    await selectElement(page, await firstAccordion.locator(".accordion-item__toggle").elementHandle(), inputType);

    const firstAccordionContent = firstAccordion.locator(".accordion-item__content").first();
    expect(firstAccordionContent).not.toBeNull();
    await page.waitForTimeout(500);
    expect(firstAccordionContent).toBeVisible();
    const content = await firstAccordionContent.innerText();
    expect(content.length).toBeGreaterThan(0);
  });
};

test.describe("Desktop", () => {
  test.describe("with mouse", () => {
    tests("mouse");
  });

  test.describe("with keyboard", () => {
    tests("keyboard");

    test("can tab to the first accordion", async ({ page, browserName, isMobile }) => {
      const tabCountToGetToFirstAccordion = {
        firefox: {
          mobile: 7,
          desktop: 7,
        },
        default: 19,
      }
      const browserType = isMobile ? "mobile" : "desktop";

      const firstAccordionTabCount = tabCountToGetToFirstAccordion[browserName]?.[browserType] ||
        tabCountToGetToFirstAccordion[browserName] ||
        tabCountToGetToFirstAccordion.default;
      const firstAccordion = page.locator(".accordion-item__toggle").first();
      expect(firstAccordion).not.toBeFocused();
      for (let i = 0; i < firstAccordionTabCount; i++) {
        await page.keyboard.press(tabKey);
      }
      await expect(firstAccordion).toBeFocused();
    });

    test("can skip to main content", async ({ page, browserName }) => {
      if (browserName === "firefox") {
        return;
      }
      await page.keyboard.press(tabKey);
      const skipLink = page.locator("a[href='#main-content']");
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toHaveText("Skip to main content");
    });
  });

  a11yTests();
  visRegTests();
});

test.describe("Mobile", () => {
  test.beforeEach(async ({ page }) => {
    page.setViewportSize({ width: 375, height: 812 });
  });

  test.describe("with mouse", () => {
    tests("mouse");
  });

  test.describe("with keyboard", () => {
    tests("keyboard");
  });

  a11yTests();
  visRegTests();
});