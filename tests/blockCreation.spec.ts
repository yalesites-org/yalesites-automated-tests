import { expect, test, type Page } from "@playwright/test";
import { createContentType } from "@support/drupalPage";
import { createBlock } from "@support/block";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test("can create a new text block", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new page" })).toBe(true);
  expect(await createBlock(page, "text", {
    administrative_label: "My new text block",
    content: "This is a test",
    text_style_variation: "Default",
    reusable_block: false,
  })).toBe(true);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  expect(await page.title()).toBe("My new page | YaleSites");
  expect(await page.locator('p').innerText()).toBe('This is a test');
});
