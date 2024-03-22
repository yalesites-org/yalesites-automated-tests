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

test("can create an accordion block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new accordion page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "accordion", {
      administrative_label: "My new accordion block",
      accordion_component_title: "Accordion",
      accordion_items: [
        {
          accordion_item_heading: "Accordion 1",
          content: "Accordion 1 content",
        },
        {
          accordion_item_heading: "Accordion 2",
          content: "Accordion 2 content",
        },
        {
          accordion_item_heading: "Accordion 3",
          content: "Accordion 3 content",
        },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new accordion page");
});

test("can create an embed block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new embed page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "embed", {
      administrative_label: "My new embed block",
      embed_external_content:
        'embed:<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/CjtF3h0Ohhe/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/CjtF3h0Ohhe/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/CjtF3h0Ohhe/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Yale (@yale)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>',
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new embed page");
});

test("can create a custom card block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new custom card page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "custom_cards", {
      administrative_label: "My new custom card block",
      custom_cards_component_title: "Custom Card",
      cards: [
        {
          image: "jester",
          custom_card_heading: "Custom Card 1",
          custom_card_content: "This is a test custom card",
          link: "https://google.com",
        },
        {
          image: "jester",
          custom_card_heading: "Custom Card 2",
          custom_card_content: "This is another test custom card",
          link: "https://yahoo.com",
        },
        {
          image: "jester",
          custom_card_heading: "Custom Card 3",
          custom_card_content: "This is yet another test custom card",
          link: "https://duckduckgo.com",
        },
      ],
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new custom card page");
  await expect(
    page.getByRole("link", { name: /Custom Card 1/i }),
  ).toHaveAttribute("href", "https://google.com");
});

test("can create an action banner block", async ({ page }) => {
  expect(
    await createContentType(page, "page", {
      Title: "My new action banner page",
    }),
  ).toBe(true);
  expect(
    await createBlock(page, "action_banner", {
      administrative_label: "My new action banner block",
      image: "jester",
      action_banner_heading: "Action Banner",
      action_banner_content: "This is a test action banner",
      background_color: "Two",
      layout: "Left",
      heading_level: "H2: This page’s title is displayed or visually hidden",
      url: "https://google.com",
      link_text: "Google",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new action banner page");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
});

test("can create a grand hero block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new grand hero page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "grand_hero", {
      administrative_label: "My new grand hero block",
      media: "jester",
      heading: "Grand Hero",
      text: "This is a test grand hero",
      media_size: "Short",
      url: "https://google.com",
      link_text: "Google",
      overlay_position: "Floating Box",
      heading_level: "H2: This page’s title is displayed or visually hidden",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new grand hero page");
  await expect(page.getByRole("link", { name: "Google" })).toHaveAttribute(
    "href",
    "https://google.com",
  );
});

test("can create a post feed block", async ({ page }) => {
  expect(
    await createContentType(page, "page", { Title: "My new post feed page" }),
  ).toBe(true);
  expect(
    await createBlock(page, "post_feed", {
      administrative_label: "My new post feed block",
      heading: "Post Feed 1",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new post feed page");
  await expect(page.getByText(/Post Feed 1/i)).toBeVisible();
});

test("can create a calendar list block", async ({ page }) => {
  expect(
    await createContentType(page, "page", {
      Title: "My new calendar list page",
    }),
  ).toBe(true);
  expect(
    await createBlock(page, "calendar_list", {
      administrative_label: "My new calendar list block",
      heading: "Calendar List 1",
      reusable_block: false,
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await page.title()).toContain("My new calendar list page");
  await expect(page.getByText(/Calendar List 1/i)).toBeVisible();
});
