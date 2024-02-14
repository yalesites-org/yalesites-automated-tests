import { test, expect, type Page, type ElementHandle } from "@playwright/test";
import getLoginUrl from "@support/login";

const DESKTOP_SEARCH_ID = "input#edit-keywords--header-search-form-desktop";
const MOBILE_SEARCH_ID = "input#edit-keywords--header-search-form-mobile";

const getSearchId = async (page: Page) => {
  // If it is a mobile device, click the hamburger and return the mobile search id,
  // otherwise return the desktop search id.
  const isMobile = await page.evaluate(() => {
    const MIN_DESKTOP_WIDTH = 768;

    return window.innerWidth < MIN_DESKTOP_WIDTH;
  });

  if (isMobile) {
    await page.click("button.menu-toggle");
    return MOBILE_SEARCH_ID;
  }

  return DESKTOP_SEARCH_ID;
};

const tests = () => {
  test("page should have a search", async ({ page }) => {
    const search = await page.$(await getSearchId(page));

    expect(search).toBeTruthy();
  });

  test("should result in no matches if there are none", async ({ page }) => {
    const search = await page.$(await getSearchId(page));

    await search?.fill("somethingthatshouldneverexist");
    await search?.press("Enter");

    await page.waitForSelector("p");

    const searchResults = await page.$("div.search-result");
    expect(searchResults).toBeFalsy();
  });

  test('should not match "bread" for breadcrumbs', async ({ page }) => {
    const search = await page.$(await getSearchId(page));
    await search?.fill("bread");
    await search?.press("Enter");

    await page.waitForSelector("p");

    const searchResults = await page.$("div.search-result");

    expect(searchResults);

    if (searchResults) {
      const searchResultsText = await searchResults.textContent();
      expect(searchResultsText).not.toContain("breadcrumbs");
    }
  });

  test("should find results that exist", async ({ page }) => {
    const search = await page.$(await getSearchId(page));

    await search?.fill("Example");
    await search?.press("Enter");

    await page.waitForSelector("div.search-result");

    const searchResults = await page.$$("div.search-result");
    expect(searchResults.length).toBeGreaterThan(0);
  });

  test("search term is emphasized in results", async ({ page }) => {
    const search = await page.$(await getSearchId(page));
    await search?.fill("Page");
    await search?.press("Enter");

    await page.waitForSelector("div.search-result");

    const searchTermElement = page.getByRole("emphasis", { name: "Page" });
    expect(searchTermElement).toBeTruthy();
  });

  test("should have placeholder text that is not clipped", async ({ page }) => {
    const search = await page.$(await getSearchId(page));
    const searchElement = search as ElementHandle<HTMLElement>;

    // Ensure the placeholder attribute exists and has a length greater than 0
    const placeholder = await search?.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder?.length).toBeGreaterThan(0);

    // Get the width of the search input element
    const searchWidth = await page.evaluate(
      (search) => search.offsetWidth,
      searchElement,
    );

    // Calculate the width of the placeholder text
    const placeholderWidth = await page.evaluate((search) => {
      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.font = getComputedStyle(search).font;
      span.textContent = search.getAttribute("placeholder");
      document.body.appendChild(span);
      const width = span.offsetWidth;
      document.body.removeChild(span);
      return width;
    }, searchElement);

    // Check if the placeholder text's width is less than or equal to the
    // search box's width
    expect(placeholderWidth).toBeLessThanOrEqual(searchWidth);
  });
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

tests();