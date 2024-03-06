import { type Page } from "@playwright/test";
import { ensureLoggedIn } from "@support/login";

type PageType = "profile" | "page" | "post" | "event";

interface ContentTypeOptions {
  event: {
    title: string;
    event_type: "In-person" | "Online";
    start_date: Date;
    start_time: string;
    end_date: Date;
    end_time: string;
    [key: string]: any;
  },
  page: {
    title: string,
    [key: string]: any;
  },
  post: {
    title: string,
    [key: string]: any;
  },
  profile: {
    first_name: string;
    last_name: string;
    [key: string]: any;
  },
};


/*
 * Create a new page content type
 * @param pageType - the type of page to create
 * @param opts - an array of options to set on the page
 * @returns true if the page was created, false if not
 */
async function createContentType(
  page: Page,
  pageType: PageType,
  opts: Partial<ContentTypeOptions[PageType]>,
) {
  await page.goto("/node/add/" + pageType);

  try {
    // For each item inside of pageType, loop through and set each value.
    for (const [key, value] of Object.entries(opts)) {
      if (typeof value === "string") {
        await page.fill(`[name="${key}[0][value]"]`, value);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          await page.fill(`[name="${key}[0][value]"]`, item);
        }
      } else if (typeof value === "object") {
        for (const [subKey, subValue] of Object.entries(value)) {
          await page.fill(`[name="${key}[${subKey}][0][value]"]`, subValue);
        }
      }
    }

    await page.getByRole('button', { name: 'Save' }).click();
  } catch (err) {
    return false;
  }

  return true;
}

export { createContentType, ContentTypeOptions, PageType }
