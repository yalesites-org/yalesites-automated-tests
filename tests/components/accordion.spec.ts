import { expect, test, type Page, ElementHandle } from "@playwright/test";
import { selectElement, type InputType } from "support/a11ySelectElement";
import tabKeyForBrowser from "support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

const toggleExpandCollapseAll = async (
  page: Page,
  inputType: InputType,
  key: string = "Enter",
): Promise<void> => {
  const expandAllButton = await page.$(".accordion__toggle-all");

  await selectElement(page, expandAllButton, inputType, key);
};

const toggleAccordionsIndividually = async (
  page: Page,
  accordionButtons: ElementHandle<SVGElement | HTMLElement>[],
  inputType: InputType,
  key: string = "Enter",
): Promise<void> => {
  for (const item of accordionButtons) {
    await selectElement(page, item, inputType, key);
  }
};

const checkAccordionAriaExpandedState = async (
  accordionButtons: ElementHandle[],
  expectedState: string,
) => {
  for (const item of accordionButtons) {
    expect(await item.getAttribute("aria-expanded")).toBe(expectedState);
  }
};

let tabKey: string;
test.beforeEach(async ({ page, defaultBrowserType }) => {
  // Webkit uses Alt+Tab over Tab to traverse, so we capture this before a test is done.
  tabKey = tabKeyForBrowser(defaultBrowserType);
  await page.goto("/component-pages-for-e2e-testing/accordion");
  await page.waitForLoadState("load");
  page.locator("body");
});

const tests = (inputType: InputType) => {
  test.describe("common tests", () => {
    test("if some accordions are open, ensure that the toggle button is set to Expand All", async ({
      page,
    }) => {
      const accordionButtons = await page.$$(".accordion-item__toggle");
      const firstAccordion = accordionButtons[0];
      await selectElement(page, firstAccordion, inputType);
      const expandAllButton = await page.$(".accordion__toggle-all");

      expect(await expandAllButton?.innerText()).toBe("Expand All");
    });

    test("if all accordions are manually expanded, ensure that the toggle button is set to Collapse All", async ({
      page,
    }) => {
      const accordionButtons = await page.$$(".accordion-item__toggle");
      for (const item of accordionButtons) {
        await selectElement(page, item, inputType);
      }
      const collapseAllButton = await page.$(".accordion__toggle-all");

      expect(await collapseAllButton?.innerText()).toBe("Collapse All");
    });

    test("first accordion title is displayed", async ({ page }) => {
      const firstAccordionTitle = await page.$(".accordion-item__heading");
      expect(firstAccordionTitle).not.toBeNull();
    });

    test("first accordion content is displayed when expanded", async ({
      page,
    }) => {
      const firstAccordion = page.locator(".accordion-item").first();
      await selectElement(
        page,
        await firstAccordion.locator(".accordion-item__toggle").elementHandle(),
        inputType,
      );

      const firstAccordionContent = firstAccordion
        .locator(".accordion-item__content")
        .first();
      expect(firstAccordionContent).not.toBeNull();
      await page.waitForTimeout(500);
      expect(firstAccordionContent).toBeVisible();
      const content = await firstAccordionContent.innerText();
      expect(content.length).toBeGreaterThan(0);
    });
  });
};

test.describe("with mouse", () => {
  tests("mouse");

  test("Expand All should open all accordions", async ({ page }) => {
    await toggleExpandCollapseAll(page, "mouse");
    const accordionButtons = await page.$$(".accordion-item__toggle");
    await checkAccordionAriaExpandedState(accordionButtons, "true");
  });

  test("Collapse All should close all accordions", async ({ page }) => {
    // First open them all.
    await toggleExpandCollapseAll(page, "mouse");
    const accordionButtons = await page.$$(".accordion-item__toggle");
    await checkAccordionAriaExpandedState(accordionButtons, "true");

    // Now close them all
    await toggleExpandCollapseAll(page, "mouse");
    await checkAccordionAriaExpandedState(accordionButtons, "false");
  });
});

test.describe("with keyboard", () => {
  tests("keyboard");

  test("can tab to the first accordion", async ({
    page,
    browserName,
    isMobile,
  }) => {
    // The animation of the menu seems to be affecting tabbing to the first accordion.
    // We wait for a bit to ensure the animation is done.
    await page.waitForTimeout(500);
    const tabCountToGetToFirstAccordion = {
      firefox: {
        mobile: 7,
        desktop: 7,
      },
      webkit: {
        mobile: 8,
      },
      chromium: {
        mobile: 8,
      },
      default: 19,
    };
    const browserType = isMobile ? "mobile" : "desktop";

    const firstAccordionTabCount =
      tabCountToGetToFirstAccordion[browserName]?.[browserType] ||
      tabCountToGetToFirstAccordion.default;
    const firstAccordionItem = page.locator(".accordion-item__toggle").first();
    expect(firstAccordionItem).not.toBeFocused();
    for (let i = 0; i < firstAccordionTabCount; i++) {
      await page.keyboard.press(tabKey);
    }
    await expect(firstAccordionItem).toBeFocused();
  });

  test("can skip to main content", async ({ page, browserName }) => {
    // Firefox can't target skip to main?  WHy?!?
    if (browserName === "firefox") {
      return;
    }
    await page.keyboard.press(tabKey);
    const skipLink = page.locator("a[href='#main-content']");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveText("Skip to main content");
  });

  test.describe("with ENTER key", () => {
    test("should open and close", async ({ page }) => {
      const accordionButtons = await page.$$(".accordion-item__toggle");

      await toggleAccordionsIndividually(
        page,
        accordionButtons,
        "keyboard",
        "Enter",
      );
      await checkAccordionAriaExpandedState(accordionButtons, "true");

      await toggleAccordionsIndividually(
        page,
        accordionButtons,
        "keyboard",
        "Enter",
      );
      await checkAccordionAriaExpandedState(accordionButtons, "false");
    });

    test("Expand All should open all accordions", async ({ page }) => {
      await toggleExpandCollapseAll(page, "keyboard");
      const accordionButtons = await page.$$(".accordion-item__toggle");
      await checkAccordionAriaExpandedState(accordionButtons, "true");
    });

    test("Collapse All should close all accordions", async ({ page }) => {
      // First open them all.
      await toggleExpandCollapseAll(page, "keyboard", "Enter");
      const accordionButtons = await page.$$(".accordion-item__toggle");
      await checkAccordionAriaExpandedState(accordionButtons, "true");

      // Now close them all
      await toggleExpandCollapseAll(page, "keyboard", "Enter");
      await checkAccordionAriaExpandedState(accordionButtons, "false");
    });
  });

  test.describe("with SPACE key", () => {
    test("should open and close", async ({ page }) => {
      const accordionButtons = await page.$$(".accordion-item__toggle");

      await toggleAccordionsIndividually(
        page,
        accordionButtons,
        "keyboard",
        "Space",
      );
      await checkAccordionAriaExpandedState(accordionButtons, "true");

      await toggleAccordionsIndividually(
        page,
        accordionButtons,
        "keyboard",
        "Space",
      );
      await checkAccordionAriaExpandedState(accordionButtons, "false");
    });

    test("Expand All should open all accordions", async ({ page }) => {
      await toggleExpandCollapseAll(page, "keyboard", "Space");
      const accordionButtons = await page.$$(".accordion-item__toggle");
      await checkAccordionAriaExpandedState(accordionButtons, "true");
    });

    test("Collapse All should close all accordions", async ({ page }) => {
      // First open them all.
      await toggleExpandCollapseAll(page, "keyboard", "Space");
      const accordionButtons = await page.$$(".accordion-item__toggle");
      await checkAccordionAriaExpandedState(accordionButtons, "true");

      // Now close them all
      await toggleExpandCollapseAll(page, "keyboard", "Space");
      await checkAccordionAriaExpandedState(accordionButtons, "false");
    });
  });
});

visRegTests();

a11yTests();
