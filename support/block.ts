import { type Page } from '@playwright/test';

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
  },
  quote: {
    administrative_label: string;
    quote: string;
    attribution?: string;
    style: "Bar Left" | "Bar Right" | "Quote Left";
    reusable_block: boolean;
  },
  button_link: {
    administrative_label: string;
    button_links: {
      url: string;
      title: string;
    }[];
    reusable_block: boolean;
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
  },
  divider: {
    administrative_label: string;
    divider_position: "Left" | "Center";
    divider_width: "100" | "75" | "50" | "25";
    reusable_block: boolean;
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
  },
};

const createBlock = async (page: Page, blockType: BlockType, block: Partial<Block[BlockType]>) => {
  // Convert to human readable block type name.
  const blockTypeLabel = blockType.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  await page.getByRole('link', { name: 'Add block in Content Section' }).last().click({ force: true });
  await page.waitForSelector('text=Choose a block');
  await page.getByRole('link', { name: blockTypeLabel }).click();

  const selectItems = ["Text Style Variation"];

  for (const key in block) {
    let label = key.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // If label contains content, rename it to target 'Editor editing area: main'
    if (label.includes('Content')) {
      label = 'Editor editing area: main';
    }

    let fn = 'fill';

    if (block[key] === true || block[key] === false) {
      fn = 'setChecked';
    } else if (selectItems.includes(label)) {
      fn = 'selectOption';
    }

    await page.getByLabel(label).first()[fn](block[key]);
  }

  await page.getByRole('button', { name: 'Add block' }).click({ force: true });

  return true;
};

export { createBlock };
