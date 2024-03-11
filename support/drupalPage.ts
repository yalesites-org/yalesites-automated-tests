import { type Page } from "@playwright/test";

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
      // If value ends in AM or PM, we have to fill in the hour, then tab, then
      // fill in the minute, then tab, then fill in the AM/PM
      else if (value.match(/(AM|PM)$/)) {
        value = toMilitaryTime(value);
      }

      let element = null;
      // Can support selectors or just text to get the input
      if (!key.match(/^[#.]/)) {
        // For some reason, the required asterisk is sometimes used as part of
        // the label, and so it doesn't properly match.  This ensures that we
        // cover that situation so that we can consitently get the right input.
        const regex = new RegExp(`${key}(?: \\*)?`);

        element = page.getByLabel(regex);
      } else {
        element = page.locator(key);
      }

      await element[method](value);
    }

    await page.getByRole('button', { name: 'Save' }).click();
  } catch (err) {
    return false;
  }

  return true;
}

/*
 * Convert a time from AM/PM to 24-hour time
 *
 * @param time - the time to convert
 *
 * @returns the time in 24-hour format
 *
 * @example
 * toMilitaryTime("12:00 PM") // 12:00
 * toMilitaryTime("12:00 AM") // 00:00
 * toMilitaryTime("3:00 PM") // 15:00
 * toMilitaryTime("3:00 AM") // 03:00
 * toMillitaryTime("15:00") // 15:00
 * toMillitaryTime("blah") // blah
 */
function toMilitaryTime(time: string) {
  let timeParts = time.split(" ");
  let [hour, minute] = timeParts[0].split(":");

  if (hour === '' || parseInt(hour) > 12) {
    return time;
  }

  let ampm = timeParts[1];

  if (ampm === "PM" && hour !== "12") {
    hour = String(Number(hour) + 12);
  } else if (ampm === "AM" && hour === "12") {
    hour = "00";
  }

  // Make sure it's in the form HH:mm where HH is 00-23
  if (hour.length === 1) {
    hour = `0${hour}`;
  }

  return `${hour}:${minute}`;
}

export { createContentType, ContentTypeOptions, PageType }
