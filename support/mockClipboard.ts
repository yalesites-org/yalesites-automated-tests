import { Page } from "@playwright/test";

/**
 * Graciously taken from: https://github.com/microsoft/playwright/issues/13037#issuecomment-1740643562
 * this will mock the browsers clipboard API, since it might not be available in the test environment
 * due to invalid permissions. It's recommended to use this function in the beforeAll or beforeEach hook
 * of the test to inject the mock into the page very early. It will e.g. not work if it's called after
 * page.goto() has been called.
 */
export const mockClipboardAPI = async (page: Page) =>
  await page.addInitScript(() => {
    // create a mock of the clipboard API
    const mockClipboard = {
      clipboardData: "",
      writeText: async (text: string) => {
        mockClipboard.clipboardData = text;
      },
      readText: async () => mockClipboard.clipboardData,
    };

    // override the native clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  });
