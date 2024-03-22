import { type Page, type Locator } from "@playwright/test";

// Any global timeouts inside of here is this
// I don't want to use this, but it's the only way to have the DOM updated when
// clicking buttons.
const globalTimeout = 2500;

type BlockType =
  | "text"
  | "image"
  | "video"
  | "wrapped_image"
  | "quote"
  | "button_link"
  | "callout"
  | "divider"
  | "spotlight_landscape"
  | "spotlight_portrait"
  | "quick_links"
  | "gallery"
  | "media_grid"
  | "accordion"
  | "embed"
  | "custom_cards"
  | "action_banner"
  | "grand_hero"
  | "post_feed"
  | "calendar_list"
  | "profile_directory"
  | "view"
  | "pre_built_form"
  | "tabs";

interface Block {
  text: {
    administrative_label: string;
    content: string;
    text_style_variation: "Default" | "Emphasized";
    reusable_block: boolean;
    [key: string]: any;
  };
  image: {
    administrative_label: string;
    image: string;
    image_caption: string;
    reusable_block: boolean;
    [key: string]: any;
  };
  video: {
    administrative_label: string;
    video_component_title: string;
    video_description: string;
    video: string;
    reusable_block: boolean;
    [key: string]: any;
  };
  wrapped_image: {
    administrative_label: string;
    content?: string;
    image: string;
    caption?: string;
    position: "Image Left" | "Image Right";
    offset: "Offset" | "Inline";
    reusable_block: boolean;
    [key: string]: any;
  };
  quote: {
    administrative_label: string;
    quote: string;
    attribution?: string;
    style: "Bar Left" | "Bar Right" | "Quote Left";
    reusable_block: boolean;
    [key: string]: any;
  };
  button_link: {
    administrative_label: string;
    button_links: {
      url: string;
      title: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  };
  callout: {
    administrative_label: string;
    callout_items: {
      callout_item_heading: string;
      callout_content: string;
      link: {
        url: string;
        link_text: string;
      };
    }[];
    alignment: "Center" | "Left";
    background_color: "One" | "Two" | "Three";
    reusable_block: boolean;
    [key: string]: any;
  };
  divider: {
    administrative_label: string;
    divider_position: "Left" | "Center";
    divider_width: "100" | "75" | "50" | "25";
    reusable_block: boolean;
    [key: string]: any;
  };
  spotlight_landscape: {
    administrative_label: string;
    image: string;
    heading: string;
    subheading: string;
    content: string;
    link: {
      url: string;
      link_text: string;
    };
    theme_color: "Default - No Color" | "One" | "Two" | "Three";
    image_position: "Left" | "Right";
    image_size: "Large" | "Medium";
    focus: "Equal Focus" | "Image Focus";
    reusable_block: boolean;
    [key: string]: any;
  };
  spotlight_portrait: {
    administrative_label: string;
    image: string;
    heading: string;
    subheading: string;
    content: string;
    link: {
      url: string;
      link_text: string;
    };
    theme_color: "Default - No Color" | "One" | "Two" | "Three";
    image_position: "Image Left" | "Image Right";
    image_style: "Inline" | "Offset";
    reusable_block: boolean;
    [key: string]: any;
  };
  quick_links: {
    administrative_label: string;
    quick_links_component_title: string;
    quick_link_content: string;
    links: {
      url: string;
      link_text: string;
    }[];
    image: string;
    reusable_block: boolean;
    [key: string]: any;
  };
  gallery: {
    administrative_label: string;
    gallery_component_title: string;
    gallery_items: {
      image: string;
      gallery_item_heading: string;
      gallery_image_caption: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  };
  media_grid: {
    administrative_label: string;
    image_grid_component_title: string;
    image_grid_items: {
      image: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  };
  accordion: {
    administrative_label: string;
    accordion_component_title: string;
    accordion_items: {
      accordion_item_heading: string;
      content: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  };
  embed: {
    administrative_label: string;
    embed_external_content: string;
    reusable_block: boolean;
    [key: string]: any;
  };
  custom_cards: {
    administrative_label: string;
    custom_cards_component_title: string;
    cards: {
      image: string;
      custom_card_heading: string;
      custom_card_content: string;
      link: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  };
  action_banner: {
    administrative_label: string;
    image: string;
    action_banner_heading: string;
    action_banner_content: string;
    background_color: "One" | "Two" | "Three";
    layout: "Bottom" | "Left" | "Right";
    heading_level:
      | "H2: This page's title is displayed or visually hidden"
      | "H1: This page's title is hidden";
    url: string;
    link_text: string;
    reusable_block: boolean;
    [key: string]: any;
  };
  grand_hero: {
    administrative_label: string;
    media: string;
    heading: string;
    text: string;
    media_size: "Tall" | "Short";
    url: string;
    link_text: string;
    overlay_position: "Full" | "Floating Box";
    heading_level:
      | "H1: This page's title is hidden"
      | "H2: This page's title is displayed or visually hidden";
    reusable_block: boolean;
    [key: string]: any;
  };
}

// Taken from Playwright since for some reason @playwright/test doesn't have
// this exposed for us?
type AriaRole =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "blockquote"
  | "button"
  | "caption"
  | "cell"
  | "checkbox"
  | "code"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "deletion"
  | "dialog"
  | "directory"
  | "document"
  | "emphasis"
  | "feed"
  | "figure"
  | "form"
  | "generic"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "insertion"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "marquee"
  | "math"
  | "meter"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "paragraph"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "strong"
  | "subscript"
  | "superscript"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "time"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

const blockSearch = {
  spotlight_landscape: "Spotlight - Landscape",
  spotlight_portrait: "Spotlight - Portrait",
};

/*
 * Create a block
 * Note: This assumes you're already logged in and on the page you want to
 * create a block on the page you want to create a block on.
 *
 * @param page - the Playwright page
 * @param blockType - the type of block to create
 * @param block - the block to create
 *
 * @returns true if the block was created, false if not
 *
 * @example
 * createBlock(page, "text", {
 *  administrative_label: "My new text block",
 *  content: "This is a test",
 *  text_style_variation: "Default",
 *  reusable_block: false,
 *  });
 *
 *  createBlock(page, "quick_links", {
 *  administrative_label: "My new quick links block",
 *  quick_links_component_title: "Quick Links",
 *  quick_links: [
 *  { url: "https://yalesites.yale.edu", link_text: "YaleSites main page" },
 *  { url: "https://google.com", link_text: "Google" },
 *  { url: "https://yahoo.com", link_text: "Yahoo" },
 *  ],
 *  reusable_block: false,
 *  });
 */
const createBlock = async (
  page: Page,
  blockType: BlockType,
  block: Partial<Block[BlockType]>,
) => {
  const blockTypeLabel = blockSearch[blockType] || humanize(blockType);

  await page
    .getByRole("link", { name: "Add block in Content Section" })
    .last()
    .click({ force: true });
  // Would love to not have to use locator here.  Fix if you can.
  const layoutBuilderModal = page.locator("div#layout-builder-modal");
  await layoutBuilderModal
    .getByRole("link", { name: blockTypeLabel })
    .first()
    .click({ force: true });
  await page.waitForLoadState("networkidle");

  await fillInForm(page, block);

  await page.getByRole("button", { name: "Add block" }).click({ force: true });

  return true;
};

/*
 * Fill in a form
 *
 * @param page - the Playwright page
 * @param elements - the elements to fill in
 * @param index - the index of the element to fill in in the event we have
 *   multiple items (think subitems like quick link links)
 *
 * @returns void
 *
 * @example
 * fillInForm(page, {
 * Title: "My new page",
 * "Teaser Title": "Hi",
 * });
 */
const fillInForm = async (
  page: Page,
  elements: { [key: string]: any },
  index: number = 0,
) => {
  for (const key in elements) {
    await fillInFormElement(page, key, elements[key], index);
  }
};

/*
 * Fill in a form element
 *
 * @param page - the Playwright page
 * @param key - the key of the element to fill in
 * @param value - the value to fill in
 * @param index - the index of the element to fill in in the event we have
 *  multiple items (think subitems like quick link links)
 *
 *  @returns void
 *
 *  @example
 *
 *  fillInFormElement(page, "Title", "My new page");
 *
 *  fillInFormElement(page, "Teaser Title", "Hi");
 *
 *  fillInFormElement(page, "quick_links", [
 *  { url: "https://yalesites.yale.edu", link_text: "YaleSites main page" },
 *  { url: "https://google.com", link_text: "Google" },
 *  { url: "https://yahoo.com", link_text: "Yahoo" },
 *  ]);
 *
 *  Note: in the above case with an array of values, the "quick_links" key is
 *  not used.  It is a placeholder name so users can understand what they will
 *  be.
 */
const fillInFormElement = async (
  page: Page,
  key: string,
  value: any,
  index: number = 0,
) => {
  if (value instanceof Array) {
    // And if we have an "Add another item" button.
    const addAnotherItemText = await page.evaluate(() => {
      const possibleButtons = [
        "Add another item",
        "Add Callout Item",
        "Add Gallery Item",
        "Add Image Grid Item",
        "Add Accordion Item",
        "Add Custom Card",
      ];
      const elementValues = Array.from(
        document.querySelectorAll<HTMLButtonElement>("input[type='submit']"),
      ).map((el) => el.value);

      for (const button of possibleButtons) {
        if (elementValues.includes(button)) {
          return button;
        }
      }

      return null;
    });

    for (let index = 0; index < value.length; index++) {
      await fillInForm(page, value[index], index);
      try {
        // Click the "Add another item" button if it's not the last one
        if (index !== value.length - 1) {
          if (addAnotherItemText != null) {
            await page.waitForTimeout(globalTimeout);
            await page
              .getByRole("button", { name: addAnotherItemText })
              .click();
            await page.waitForLoadState("networkidle");
            await page.waitForTimeout(globalTimeout);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  } else if (value instanceof Object) {
    await fillInForm(page, value, 0);
  } else {
    let elementType = "input";
    let label = humanize(key);

    let context: Page | Locator = page;

    const ckEditorLabels = [
      "Content",
      "Caption",
      "Image Caption",
      "Video Description",
      "Quote",
      "Attribution",
      "Callout Content",
      "Gallery Image Caption",
      "Custom Card Content",
      "Action Banner Content",
      "Text",
    ];
    // If label contains content, rename it to target
    // 'Editor editing area: main'
    if (ckEditorLabels.includes(label)) {
      // I don't like targeting this but it's the only way to target via the
      // wrapper.
      context = context.locator("div.glb-form-textarea-wrapper", {
        has: page.getByLabel(label, { exact: true }) as Locator,
      });
      label = "Editor editing area: main";
    }

    const mediaLabels = ["Image", "Media", "Video", "Embed External Content"];
    if (mediaLabels.includes(label)) {
      label = "Add media";
      elementType = "button";
    }

    const regex = new RegExp(label, "i");

    const numElements = await context
      .locator("label", { hasText: regex })
      .count();
    if (numElements < index + 1) {
      // Let's assume the last one is empty for us
      index = numElements - 1;
    }

    if (label === "Layout") {
      elementType = "combobox";
    }

    let element = null;
    if (elementType === "input") {
      element = context.getByLabel(regex).nth(index);
    } else {
      element = context
        .getByRole(elementType as AriaRole, { name: regex })
        .nth(index);
    }
    await fillAny(element, value);
  }
};

/*
 * Humanize a string
 *
 * @param str - the string to humanize
 *
 * @returns the humanized string
 *
 * @example
 *
 * humanize("quick_links") // "Quick Links"
 * humanize("quick_links_component_title") // "Quick Links Component Title"
 * humanize("image") // "Image"
 */
const humanize = (str: string) => {
  if (str.includes("_")) {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Fill in any element
 * @param element - the element to fill in
 * @param value - the value to fill in
 * @returns void
 * @example
 * fillAny(page.getByLabel("Title"), "My new page");
 */
const fillAny = async (element: Locator, value: any) => {
  const tagName = await element.evaluate((node) => node.tagName);
  const type = await element.evaluate((node) => node.getAttribute("type"));

  if (value === true || value === false) {
    await element.setChecked(value);
  } else if (tagName === "SELECT") {
    await element.selectOption(value);
  } else if (type === "submit") {
    await selectOrUploadMediaItem(element, value);
  } else {
    await element.fill(value);
  }
};

const selectOrUploadMediaItem = async (element: Locator, value: string) => {
  if (value.match(/^https?:\/\//)) {
    return await uploadMediaItem(element, value);
  }

  if (value.match(/^embed:/)) {
    return await selectEmbedItem(element, value);
  }

  return await selectMediaItem(element, value);
};

const uploadMediaItem = async (_element: Locator, _value: string) => {
  console.log("I should be uploading a document now.  But I'm not.");
};

const selectMediaItem = async (element: Locator, value: string) => {
  const page = element.page();
  await element.click();
  await page.getByRole("button", { name: "Add media" }).click({ force: true });
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Name").click();
  await page.getByLabel("Name").fill(value);
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.getByRole("checkbox").nth(2).check();
  await page.getByRole("button", { name: "Insert selected" }).click();
  // Need this to get past insert selected click for some reason
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(globalTimeout);
};

const selectEmbedItem = async (element: Locator, value: string) => {
  const randomNumber = Math.floor(Math.random() * 10000);
  const embedValue = value.replace("embed:", "");
  const page = element.page();
  await element.click();
  await page.getByRole("button", { name: "Add media" }).click({ force: true });
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("textbox", { name: "Embed Code or URL" })
    .fill(embedValue);
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.waitForTimeout(globalTimeout);
  await page.getByLabel("Title", { exact: true }).fill(`Embed ${randomNumber}`);
  await page
    .getByLabel("Add or select media")
    .getByRole("button", { name: "Save" })
    .click({ force: true });
  await page.waitForTimeout(globalTimeout);
  await page
    .getByRole("button", { name: "Insert selected" })
    .click({ force: true });
  await page.waitForTimeout(globalTimeout);
};

export { createBlock };
