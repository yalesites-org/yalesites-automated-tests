import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "pre-built-form");
});

test("has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Pre-Built Form', exact: true })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a form with four fields and a submit button", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Pre-Built Form Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Your Name')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Your Name')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Your Email')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Your Email')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Subject')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Subject')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByText('Message')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByLabel('Message')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
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

a11yTests();
visRegTests();