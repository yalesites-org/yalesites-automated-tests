import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import {
  pressKeyForBrowser,
  type PressKeyForBrowserFunction,
} from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "directory");
});

test("has a heading", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Directory Heading" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has an affiliation label", async ({ page }) => {
  await expect(page.getByText("Affiliation")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has an affiliation drop down", async ({ page }) => {
  await expect(page.getByLabel("Affiliation")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has an apply button", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a directory entry", async ({ page }) => {
  await expect(
    page.getByRole("img", { name: "Portrait of Tom Foolery" }),
  ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText("Information Technology")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole("link", { name: "Tom Foolery" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText("Chief Silliness Officer")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText("Deputy CIO")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole("link", { name: "Email" })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText("-432-0987")).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:tom.foolery@yale.edu",
  );
});

test("can select an affiliation", async ({ page }) => {
  await page.getByLabel("Affiliation").selectOption("32");
  await page.getByRole("button", { name: "Apply" }).click();
  await page.waitForLoadState("load");
  await expect(page.getByLabel("Affiliation")).toHaveValue("32");
});

a11yTests();
visRegTests();