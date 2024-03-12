import { test as setup } from "@playwright/test";
import { ensureLoggedIn } from "@support/login";

const siteAdminFile = 'playwright/.auth/siteAdmin.json';

setup('authenticate as a site admin', async ({ page }) => {
  const loginUrl = ensureLoggedIn("siteAdminUser", ["site_admin"], "../yalesites-project");
  console.log('loginUrl', loginUrl);
  await page.goto(loginUrl);

  await page.context().storageState({ path: siteAdminFile });
});

const platformAdminFile = 'playwright/.auth/platformAdmin.json';

setup('authenticate as a platform admin', async ({ page }) => {
  const loginUrl = ensureLoggedIn("platformAdmin", ["platform_admin"], "../yalesites-project");
  await page.goto(loginUrl);

  await page.context().storageState({ path: platformAdminFile });
});
