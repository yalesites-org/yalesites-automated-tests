import { Page } from "@playwright/test";

export type TabCounts = {
  [key: string]: number | { mobile: number; desktop: number };
};

export type PressKeyForBrowserFunction =
  (page: Page, times?: number | TabCounts) => Promise<void>;

export type Platform = "desktop" | "mobile";

/**
 * The default number of tabs to press for each browser
 */
const BROWSER_DEFAULTS = {
  chromium: 19,
  firefox: 7,
  webkit: {
    mobile: 8,
    desktop: 19,
  },
  default: 0,
};

/**
 * Get the tab key for the browser
 * @param {string} browserType - The browser type
 * @returns {string} - The tab key for the browser
 */
export function tabKeyForBrowser(browserType: string): string {
  const SafariNames = ["webkit", "Mobile Safari", "Safari"];
  let key = "Tab";

  if (SafariNames.includes(browserType)) {
    key = "Alt+Tab";
  }

  return key;
}

/**
 * Press the tab key for the browser
 * @param {string} browserType - The browser type
 * @returns {PressKeyForBrowserFunction} - The function to press the tab key for the browser
 */
export function pressKeyForBrowser(browserType: string, isMobile: boolean): PressKeyForBrowserFunction {
  return async (page: Page, times: number | TabCounts = BROWSER_DEFAULTS): Promise<void> => {
    pressKey(page, times, tabKeyForBrowser(browserType), browserType, isMobile);
  }
}

/**
 * Press a key a number of times on a page
 * @param {Page} page - The page
 * @param {number | TabCounts} times - The number of times to press the key
 * @param {string} key - The key to press
 * @returns {Promise<void>} - The promise
 */
export async function pressKey(page: Page, times: number | TabCounts, key: string, browserName: string, isMobile: boolean): Promise<void> {
  let numberOfPresses: number;
  if (typeof times === "number") {
    numberOfPresses = Number(times);
  } else {
    const platform: Platform = isMobile ? "mobile" : "desktop";
    numberOfPresses = findNumberOfPresses(times, platform, browserName);
  }

  for (let i = 0; i < numberOfPresses; i++) {
    await page.keyboard.press(key);
  }
}

/**
 * Find the number of times to press the key given a list of possibilities
 * @param {TabCounts} browserTabNumbers - The list of browsers, platforms, and counts
 * @param {string} platform - The platform: desktop or mobile
 * @param {string} browserName - The browser name
 * @returns {number} - The number of times to press the key
 */
function findNumberOfPresses(browserTabNumbers: TabCounts, platform: string, browserName: string): number {
  let numberOfPresses = browserTabNumbers[browserName]?.[platform];

  if (numberOfPresses === undefined) {
    if (typeof browserTabNumbers[browserName] === 'number') {
      numberOfPresses = browserTabNumbers[browserName];
    } else {
      numberOfPresses = browserTabNumbers['default'] ?? 0;
    }
  }

  return numberOfPresses;
}
