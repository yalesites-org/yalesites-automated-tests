import { expect, test } from "@playwright/test";
import { createContentType } from "@support/drupalPage";
import { createBlock } from "@support/block";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test.beforeEach(async ({ isMobile }) => {
  if (isMobile) {
    test.skip();
  }
});

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
  expect(page.getByRole('paragraph')).toHaveText('This is a test');
});

test("can create a new quick links block", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new quick links page" })).toBe(true);
  expect(await createBlock(page, "quick_links", {
    administrative_label: "My new quick links block",
    quick_links_component_title: "Quick Links",
    quick_links: [
      { url: "https://yalesites.yale.edu", link_text: "YaleSites main page" },
      { url: "https://google.com", link_text: "Google" },
      { url: "https://yahoo.com", link_text: "Yahoo" },
    ],
    reusable_block: false,
  })).toBe(true);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page).toHaveTitle("My new quick links page | YaleSites");
  await expect(page.getByRole('heading', { name: 'Quick Links', exact: true })).toHaveText('Quick Links');
  await expect(page.getByRole('link', { name: 'YaleSites main page' })).toHaveAttribute('href', 'https://yalesites.yale.edu');
  await expect(page.getByRole('link', { name: 'Google' })).toHaveAttribute('href', 'https://google.com');
  await expect(page.getByRole('link', { name: 'Yahoo' })).toHaveAttribute('href', 'https://yahoo.com');
});

test("can create an image block", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new image page" })).toBe(true);
  expect(await createBlock(page, "image", {
    administrative_label: "My new image block",
    image: "https://via.placeholder.com/150",
    image_caption: "A placeholder image",
    reusable_block: false,
  })).toBe(true);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
});
