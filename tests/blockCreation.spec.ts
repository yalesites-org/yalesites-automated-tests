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

test("can create a callout block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new callout page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "callout", {
      callout_items: [
        {
          callout_item_heading: "This is a test callout",
          callout_content: "This is a test callout",
          url: "https://google.com",
          link_text: "Google",
        },
        {
          callout_item_heading: "This is another test callout",
          callout_content: "This is another test callout",
          url: "https://yahoo.com",
          link_text: "Yahoo",
        },
      ],
      administrative_label: "My new callout block",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new callout page");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
  await expect(page.getByRole("link", { name: "Yahoo" })).toHaveAttribute(
    "href",
    "https://yahoo.com",
  );
});

test("can create a divider block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new divider page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "divider", {
      administrative_label: "My new divider block",
      divider_position: "Center",
      divider_width: "50",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new divider page");
});

test("can create a spotlight landscape block", async ({ page }) => {
  expect(
    await createContentType(page, "page", {
      Title: "My new spotlight landscape page",
    }),
  ).toBe(true);
  expect(
    await createBlock(page, "spotlight_landscape", {
      administrative_label: "My new spotlight landscape block",
      image: "jester",
      heading: "Spotlight Landscape",
      subheading: "This is a test spotlight landscape",
      content: "This is a test spotlight landscape",
      url: "https://google.com",
      link_text: "Google",
      theme_color: "Default - No Color",
      image_position: "Image Left",
      image_size: "Large",
      focus: "Equal Focus",
      reusable_block: false,
    }),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new spotlight landscape page");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
});

test("can create a spotlight portrait block", async ({ page }) => {
  expect(
    await createContentType(page, "page", {
      Title: "My new spotlight portrait page",
    }),
  ).toBe(true);
  expect(
    await createBlock(page, "spotlight_portrait", {
      administrative_label: "My new spotlight portrait block",
      image: "jester",
      heading: "Spotlight Portrait",
      subheading: "This is a test spotlight portrait",
      content: "This is a test spotlight portrait",
      url: "https://google.com",
      link_text: "Google",
      theme_color: "Default - No Color",
      image_position: "Image Left",
      image_style: "Inline",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  expect(await page.title()).toContain("My new spotlight portrait page");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
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

test("can create a gallery block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new gallery page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "gallery", {
      administrative_label: "My new gallery block",
      gallery_component_title: "Gallery",
      gallery_items: [
        {
          image: "jester",
          gallery_item_heading: "Jester",
          gallery_image_caption: "A jester",
        },
        {
          image: "jester",
          gallery_item_heading: "Jester",
          gallery_image_caption: "A jester",
        },
        {
          image: "jester",
          gallery_item_heading: "Jester",
          gallery_image_caption: "A jester",
        },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new gallery page");
});

test("can create a media grid block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new media grid page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "media_grid", {
      administrative_label: "My new media grid block",
      image_grid_component_title: "Media Grid",
      media_grid_items: [
        {
          image: "jester",
        },
        {
          image: "jester",
        },
        {
          image: "jester",
        },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new media grid page");
});
