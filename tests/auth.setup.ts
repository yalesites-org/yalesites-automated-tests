import { test as setup } from "@playwright/test";
import { ensureLoggedIn } from "@support/login";
import getLocationBasedOnUrl from "@support/projectLocation";

const projectLocation = getLocationBasedOnUrl();

const siteAdminFile = 'playwright/.auth/siteAdmin.json';

setup('authenticate as a site admin', async ({ page }) => {
  const loginUrl = ensureLoggedIn("siteAdminUser", ["site_admin"], projectLocation);
  await page.goto(loginUrl);

  await page.context().storageState({ path: siteAdminFile });
});

const platformAdminFile = 'playwright/.auth/platformAdmin.json';

setup('authenticate as a platform admin', async ({ page }) => {
  const loginUrl = ensureLoggedIn("platformAdmin", ["platform_admin"], projectLocation);
  await page.goto(loginUrl);

  await page.context().storageState({ path: platformAdminFile });
});
