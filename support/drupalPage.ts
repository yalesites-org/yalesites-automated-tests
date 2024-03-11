import { type Page } from "@playwright/test";
import { ensureLoggedIn } from "@support/login";

type PageType = "profile" | "page" | "post" | "event";

interface ContentTypeOptions {
  event: {
    Title: string;
    event_type: "In-person" | "Online";
    start_date: Date;
    start_time: string;
    end_date: Date;
    end_time: string;
    [key: string]: any;
  },
  page: {
    Title: string,
    [key: string]: any;
  },
  post: {
    Title: string,
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
    for (let [key, value] of Object.entries(opts)) {
      let method = "fill";
      // Check if value is actually the boolean true or false
      if (value === true) {
        method = "check";
      }
      // If value is a date, get the string of it.
      else if (value instanceof Date) {
        value = value.toISOString().split("T")[0];
      }
      // If value ends in AM or PM, we have to fill in the hour, then tab, then fill in the minute, then tab, then fill in the AM/PM
      else if (value.match(/(AM|PM)$/)) {
        let timeParts = value.split(" ");
        let [hour, minute] = timeParts[0].split(":");
        let ampm = timeParts[1];

        if (ampm === "PM" && hour !== "12") {
          hour = String(Number(hour) + 12);
        } else if (ampm === "AM" && hour === "12") {
          hour = "00";
        }
        console.log(hour, minute, ampm);

        // Make sure it's in the form HH:mm where HH is 00-23
        if (hour.length === 1) {
          hour = `0${hour}`;
        }
        console.log(hour, minute, ampm);

        value = `${hour}:${minute}`;
        console.log(value);
      }

      // Can support selectors or just text to get the input
      if (!key.match(/^[#.]/)) {
        await page.getByLabel(key, { exact: true })[method](value);
      } else {
        await page.locator(key)[method](value);
      }

    }

    await page.getByRole('button', { name: 'Save' }).click();
  } catch (err) {
    return false;
  }

  return true;
}

export { createContentType, ContentTypeOptions, PageType }
