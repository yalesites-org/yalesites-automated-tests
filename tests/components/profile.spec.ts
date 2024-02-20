import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import tabKeyForBrowser from "@support/tabKey";

let tabKey = "Tab";
test.beforeEach(async ({ page, browserName }) => {
  tabKey = tabKeyForBrowser(browserName);
  await page.goto("/profile/tom-foolery");
  await page.waitForLoadState("load");
});

test("has a profile", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Tom Foolery Chief Silliness' }).nth(3)).toBeVisible();
});

test("has their name, title, department, and portrait", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Tom Foolery' })).toBeVisible();
  await expect(page.getByText('Chief Silliness Officer')).toBeVisible();
  await expect(page.getByText('Deputy CIO')).toBeVisible();
  await expect(page.getByText('Information Technology')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Portrait of Tom Foolery' })).toBeVisible();
});

test("has contact information", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Contact Info tom.foolery@yale' }).nth(2)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact Info' })).toBeVisible();
  await expect(page.getByText('tom.foolery@yale.edu')).toBeVisible();
  await expect(page.getByRole('button', { name: '(copy)' })).toBeVisible();
  await expect(page.getByRole('link', { name: '-432-0987' })).toBeVisible();
  await expect(page.getByText('Middle Dr.New Haven, CT 06123')).toBeVisible();
});

test("can copy the email address", async ({ page }) => {
  await page.getByRole('button', { name: '(copy)' }).click();
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

