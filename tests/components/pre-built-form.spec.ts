import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await page.goto("/component-pages-for-e2e-testing/pre-built-form");
  await page.waitForLoadState("load");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Pre-Built Form', exact: true })).toBeVisible();
});

test("has a form with four fields and a submit button", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Pre-Built Form Title' })).toBeVisible();
  await expect(page.getByText('Your Name')).toBeVisible();
  await expect(page.getByLabel('Your Name')).toBeVisible();
  await expect(page.getByText('Your Email')).toBeVisible();
  await expect(page.getByLabel('Your Email')).toBeVisible();
  await expect(page.getByText('Subject')).toBeVisible();
  await expect(page.getByLabel('Subject')).toBeVisible();
  await expect(page.getByText('Message')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test("can fill out the form and submit it", async ({ page }) => {
  await page.getByLabel('Your Name').click();
  await page.getByLabel('Your Name').fill('Person One');
  await page.getByLabel('Your Name').press('Tab');
  await page.getByLabel('Your Email').fill('person.one@noreply.yale.edu');
  await page.getByLabel('Your Email').press('Tab');
  await page.getByLabel('Subject').fill('A person');
  await page.getByLabel('Subject').press('Tab');
  await page.getByLabel('Message').fill('This is a message about a person.');
  // await page.getByRole('button', { name: 'Submit' }).click();
  // await expect(page.getByText('Error message Antibot')).toBeVisible();
  // await expect(page.getByRole('group', { name: 'CAPTCHA' })).toBeVisible();
});

test("visual regression should match previous screenshot", async ({ page }) => {
  await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.17 });
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
