import { expect, test } from "@playwright/test";
import { createContentType } from "@support/drupalPage";
import { createBlock } from "@support/block";

test.use({ storageState: "playwright/.auth/siteAdmin.json" });

test.beforeEach(async ({ isMobile }) => {
  if (isMobile) {
    test.skip();
  }
});

test("can create a new text block", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new page" })).toBe(
    true,
  );
  expect(
    await createBlock(page, "text", {
      administrative_label: "My new text block",
      content: "This is a test",
      text_style_variation: "Default",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new page");
  expect(page.getByRole("paragraph")).toHaveText("This is a test");
});

test("can create an image block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new image page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "image", {
      administrative_label: "My new image block",
      image: "jester",
      image_caption: "A placeholder image",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });

  expect(await page.title()).toContain("My new image page");
});

test("can create a video block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new video page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "video", {
      administrative_label: "My new video block",
      video_component_title: "Video",
      video_description: "A placeholder video",
      video: "What is Drupal",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });

  expect(await page.title()).toContain("My new video page");
});

test("can create a wrapped image block", async ({ page }) => {
  expect(
    await createContentType(page, "page", {
      Title: "My new wrapped image page",
    }),
  ).toBe(true);
  expect(
    await createBlock(page, "wrapped_image", {
      administrative_label: "My new wrapped image block",
      content: "My content goes here",
      caption: "A placeholder image",
      position: "Image Left",
      style: "Inline",
      reusable_block: false,
      image: "jester",
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new wrapped image page");
});

test("can create a quote block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new quote page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "quote", {
      administrative_label: "My new quote block",
      quote: "This is a test quote",
      attribution: "Anonymous",
      style: "Bar Left",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new quote page");
});

test("can create a button link block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new button link page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "button_link", {
      administrative_label: "My new button link block",
      button_links: [
        {
          url: "https://duckduckgo.com",
          link_text: "Duck Duck Go",
        },
        {
          url: "https://google.com",
          link_text: "Google",
        },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new button link page");
  await expect(
    page.getByRole("link", { name: "Duck Duck Go" }),
  ).toHaveAttribute("href", "https://duckduckgo.com");
});

test("can create a new quick links block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new quick links page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "quick_links", {
      administrative_label: "My new quick links block",
      quick_links_component_title: "Quick Links",
      quick_links: [
        { url: "https://yalesites.yale.edu", link_text: "YaleSites main page" },
        { url: "https://google.com", link_text: "Google" },
        { url: "https://yahoo.com", link_text: "Yahoo" },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new quick links page");
  await expect(
    page.getByRole("heading", { name: "Quick Links", exact: true }),
  ).toHaveText("Quick Links");
  await expect(
    page.getByRole("link", { name: "YaleSites main page" }),
  ).toHaveAttribute("href", "https://yalesites.yale.edu");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
  await expect(page.getByRole("link", { name: "Yahoo" })).toHaveAttribute(
    "href",
    "https://yahoo.com",
  );
});
