import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { ensureLoggedIn } from "@support/login";

test("Create a new page content type", async ({ page }) => {
  const loginUrl = ensureLoggedIn("siteAdminUser", ["site administrator"], "../yalesites-project");
  await page.goto(loginUrl);
  await page.goto("/node/add/page");

  await page.getByLabel('Title', { exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Test page');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveTitle("Edit layout for Test page | YaleSites");
});
