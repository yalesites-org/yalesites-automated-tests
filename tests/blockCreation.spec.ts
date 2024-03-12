import { expect, test, type Page } from "@playwright/test";
import { createContentType } from "@support/drupalPage";
import { createBlock } from "@support/block";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test("can create a new text block", async ({ page, isMobile }) => {
  if (!isMobile) {
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
  } else {
    test.skip();
  }
});

test("can create a new quick links block", async ({ page, isMobile }) => {
  if (!isMobile) {
    expect(await createContentType(page, "page", { Title: "My new quick links page" })).toBe(true);
    expect(await createBlock(page, "quick_links", {
      administrative_label: "My new quick links block",
      quick_links_component_title: "Quick Links",
      quick_links: [
        { url: "https://yalesites.yale.edu", link_text: "YaleSites" },
        { url: "https://yale.edu", link_text: "Yale" },
        { url: "https://yale.edu", link_text: "Another Yale" },
      ],
      reusable_block: false,
    })).toBe(true);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveTitle("My new quick links page | YaleSites");
    await expect(page.locator('h2')).toHaveText('Quick Links');
    await expect(page.getByRole('link', { name: 'YaleSites' })).toHaveAttribute('href', 'https://yalesites.yale.edu');
    await expect(page.getByRole('link', { name: 'Yale' })).toHaveAttribute('href', 'https://yale.edu');
    await expect(page.getByRole('link', { name: 'Another Yale' })).toHaveAttribute('href', 'https://yale.edu');
  } else {
    test.skip();
  }
});
