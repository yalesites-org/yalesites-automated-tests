import { Page } from "@playwright/test";

export type TabCounts = {
  [browser: string]:
    | {
        [platform: string]: number;
      }
    | number;
};

export type PressKeyForBrowserFunction = (
  page: Page,
  times?: number | TabCounts,
) => Promise<void>;

export type Platform = "desktop" | "mobile";

/**
 * The default number of tabs to press for each browser
 * This could change in the fututre; feels too opinionated.
 */
const BROWSER_DEFAULTS: TabCounts = {
  webkit: {
    mobile: 24,
    desktop: 46,
  },
  firefox: {
    desktop: 18,
  },
  default: 18,
};
// Create a type for the above object.

/**
 * Get the tab key for the browser
 * @param {string} browserType - The browser type
 * @returns {string} - The tab key for the browser
 */
export function tabKeyForBrowser(browserType: string): string {
  const altTabBrowsers = ["webkit", "mobile safari", "safari"];
  let key = "Tab";

  if (altTabBrowsers.includes(browserType.toLowerCase())) {
    key = "Alt+Tab";
  }

  return key;
}

/**
 * Press the tab key for the browser
 * @param {string} browserType - The browser type
 * @returns {PressKeyForBrowserFunction} - The function to press the tab key for the browser
 */
export function pressKeyForBrowser(
  browserType: string,
  isMobile: boolean,
): PressKeyForBrowserFunction {
  return async (
    page: Page,
    times: number | TabCounts = BROWSER_DEFAULTS,
  ): Promise<void> => {
    pressKey(page, times, tabKeyForBrowser(browserType), browserType, isMobile);
  };
}

/**
 * Press a key a number of times on a page
 * @param {Page} page - The page
 * @param {number | TabCounts} times - The number of times to press the key
 * @param {string} key - The key to press
 * @returns {Promise<void>} - The promise
 */
export async function pressKey(
  page: Page,
  times: number | TabCounts,
  key: string,
  browserName: string,
  isMobile: boolean,
): Promise<void> {
  let numberOfPresses: number;
  if (typeof times === "number") {
    numberOfPresses = Number(times);
  } else {
    const platform: Platform = isMobile ? "mobile" : "desktop";
    numberOfPresses = findNumberOfPresses(times, platform, browserName);
  }

  for (let i = 0; i < numberOfPresses; i++) {
    await page.keyboard.press(key);
    let activeElement = await page.evaluate(() => {
      return `${document.activeElement.tagName}: ${document.activeElement.classList}`;
    });
    // console.log(`Active element after pressing ${key} ${i + 1} times: ${activeElement}`);
  }
}

/**
 * Find the number of times to press the key given a list of possibilities
 * @param {TabCounts} browserTabNumbers - The list of browsers, platforms, and counts
 * @param {string} platform - The platform: desktop or mobile
 * @param {string} browserName - The browser name
 * @returns {number} - The number of times to press the key
 */
function findNumberOfPresses(
  browserTabNumbers: TabCounts,
  platform: string,
  browserName: string,
): number {
  let numberOfPresses = browserTabNumbers[browserName]?.[platform];

  if (numberOfPresses === undefined) {
    if (typeof browserTabNumbers[browserName] === "number") {
      numberOfPresses = browserTabNumbers[browserName];
    } else {
      numberOfPresses = browserTabNumbers["default"] ?? 0;
    }
  }

  return numberOfPresses;
}
