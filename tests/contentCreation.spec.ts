import { expect, test } from "@playwright/test";
import { createContentType } from "@support/drupalPage";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test("can create a new page", async ({ page }) => {
  expect(await createContentType(page, "page", { title: "My new page" })).toBe(true);
});
