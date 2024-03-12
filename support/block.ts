import { type Page, type Locator } from '@playwright/test';

type BlockType = "text" | "image" | "video" | "wrapped_image" | "quote" | "button_link" | "callout" | "divider" | "spotlight_landscape" | "spotlight_portrait" | "quick_links";

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

const createBlock = async (page: Page, blockType: BlockType, block: Partial<Block[BlockType]>) => {
  // Convert to human readable block type name.
  const blockTypeLabel = humanize(blockType)

  await page.getByRole('link', { name: 'Add block in Content Section' }).last().click({ force: true });
  await page.waitForSelector('text=Choose a block');
  await page.getByRole('link', { name: blockTypeLabel }).first().click({ force: true });

  await fillInForm(page, block);

  await page.getByRole('button', { name: 'Add block' }).click({ force: true });

  return true;
};

const fillInForm = async (page: Page, elements: { [key: string]: any }, index: number = 0) => {
  for (const key in elements) {
    await fillInFormElement(page, key, elements[key], index);
  }
}

const fillInFormElement = async (page: Page, key: string, value: any, index: number = 0) => {
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
    // If label contains content, rename it to target 'Editor editing area: main'
    if (label.includes('Content')) {
      label = 'Editor editing area: main';
    }

    const regex = new RegExp(label, 'i');
    const element = page.getByLabel(regex).nth(index);
    await fillAny(element, value);
  }
};

const humanize = (str: string) => {
  return str.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
