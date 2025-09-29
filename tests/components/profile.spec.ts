import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { mockClipboardAPI } from "@support/mockClipboard";
import { TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await mockClipboardAPI(page);
  await page.goto("/profile/tom-foolery");
  await page.waitForLoadState("load");
});

test("has a profile", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Tom Foolery Chief Silliness' }).nth(3)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has their name, title, department, and portrait", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Tom Foolery' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Chief Silliness Officer')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Deputy CIO')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Information Technology')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('img', { name: 'Portrait of Tom Foolery' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has contact information", async ({ page }) => {
  await expect(page.locator('#main-content div').filter({ hasText: 'Contact Info tom.foolery@yale' }).nth(2)).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('heading', { name: 'Contact Info' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('tom.foolery@yale.edu')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: '(copy)' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('link', { name: '-432-0987' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Middle Dr.New Haven, CT 06123')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("can copy the email address", async ({ page }) => {
  await page.evaluate(() =>
    document.querySelector("button.text-copy-button__button").click()
  );

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText).toEqual('tom.foolery@yale.edu');
});

a11yTests();
visRegTests();