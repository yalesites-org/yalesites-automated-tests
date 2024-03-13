import { type Page, type Locator } from '@playwright/test';

type BlockType = "text"
  | "image"
  | "video"
  | "wrapped_image"
  | "quote"
  | "button_link"
  | "callout"
  | "divider"
  | "spotlight_landscape"
  | "spotlight_portrait"
  | "quick_links";

interface Block {
  text: {
    administrative_label: string;
    content: string;
    text_style_variation: "Default" | "Emphasized";
    reusable_block: boolean;
    [key: string]: any;
  },
  image: {
    administrative_label: string;
    image: string;
    image_caption: string;
    reusable_block: boolean;
    [key: string]: any;
  },
  video: {
    administrative_label: string;
    video_component_title: string;
    video_description: string;
    video: string;
    reusable_block: boolean;
    [key: string]: any;
  },
  wrapped_image: {
    administrative_label: string;
    content?: string;
    image: string;
    caption?: string;
    position: "Image Left" | "Image Right";
    offset: "Offset" | "Inline";
    reusable_block: boolean;
    [key: string]: any;
  },
  quote: {
    administrative_label: string;
    quote: string;
    attribution?: string;
    style: "Bar Left" | "Bar Right" | "Quote Left";
    reusable_block: boolean;
    [key: string]: any;
  },
  button_link: {
    administrative_label: string;
    button_links: {
      url: string;
      title: string;
    }[];
    reusable_block: boolean;
    [key: string]: any;
  },
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
  },
  divider: {
    administrative_label: string;
    divider_position: "Left" | "Center";
    divider_width: "100" | "75" | "50" | "25";
    reusable_block: boolean;
    [key: string]: any;
  },
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
  },
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
  },
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
  },
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
  block: Partial<Block[BlockType]>) => {
  const blockTypeLabel = humanize(blockType)

  await page
    .getByRole('link', { name: 'Add block in Content Section' })
    .last()
    .click({ force: true });
  // Would love to not have to use locator here.  Fix if you can.
  const layoutBuilderModal = page.locator('div#layout-builder-modal');
  await layoutBuilderModal
    .getByRole('link', { name: blockTypeLabel })
    .first()
    .click();

  await fillInForm(page, block);

  await page.getByRole('button', { name: 'Add block' }).click({ force: true });

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
  index: number = 0) => {
  for (const key in elements) {
    await fillInFormElement(page, key, elements[key], index);
  }
}

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
  index: number = 0) => {
  if (value instanceof Array) {
    for (let index = 0; index < value.length; index++) {
      await fillInForm(page, value[index], index);
      // Click the "Add another item" button if it's not the last one.
      if (index !== (value.length - 1)) {
        await page.getByRole('button', { name: 'Add another item' }).click();
      }
    }
  } else if (value instanceof Object) {
    await fillInForm(page, value, 0);
  } else {
    let label = humanize(key);
    // If label contains content, rename it to target
    // 'Editor editing area: main'
    if (label.includes('Content')) {
      label = 'Editor editing area: main';
    }

    const regex = new RegExp(label, 'i');
    const element = page.getByLabel(regex).nth(index);
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
 */
const humanize = (str: string) => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const fillAny = async (element: Locator, value: any) => {
  const tagName = await element.evaluate(node => node.tagName);

  if (value === true || value === false) {
    await element.setChecked(value);
  } else if (tagName === 'SELECT') {
    await element.selectOption(value);
  } else {
    await element.fill(value);
  }
}

export { createBlock };
