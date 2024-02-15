import { expect, test, type Page, ElementHandle } from "@playwright/test";
import tabKeyForBrowser from "support/tabKey";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let tabKey: string;
test.beforeEach(async ({ page, defaultBrowserType }) => {
  // Webkit uses Alt+Tab over Tab to traverse, so we capture this before a test is done.
  tabKey = tabKeyForBrowser(defaultBrowserType);
  await page.goto("/component-pages-for-e2e-testing/action-banner");
  await page.waitForLoadState("load");
  page.locator("body");
});

const tests = (inputType: inputType) => {
  test("inputType exists", async ({ page }) => {
    expect(inputType).toBeDefined();
  });
};

test.describe("with mouse", () => {
  tests("mouse");
});

test.describe("with keyboard", () => {
  tests("keyboard");

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
});

visRegTests();

a11yTests();
