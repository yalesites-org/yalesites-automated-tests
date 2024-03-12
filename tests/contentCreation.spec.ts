import { expect, test, type Page } from "@playwright/test";
import { createContentType } from "@support/drupalPage";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test("can create a new page", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new page", "Teaser Title": "Hi" })).toBe(true);
  expect(await page.title()).toBe("Edit layout for My new page | YaleSites");
});

test("can create a new event", async ({ page }) => {
  expect(await createContentType(page, "event", {
    Title: "My new event",
    "Event type": "In-person",
    "Start date": new Date(),
    "Start time": "12:00 PM",
    "End date": new Date(),
    "End time": "3:00 PM",
  })).toBe(true);
  expect(await page.title()).toBe("Edit layout for My new event | YaleSites");
});

test("can create a post", async ({ page }) => {
  expect(await createContentType(page, "post", { Title: "My new post", "Teaser Title": "Hi" })).toBe(true);
  expect(await page.title()).toBe("Edit layout for My new post | YaleSites");
});

test("can create a profile", async ({ page, isMobile }) => {
  const beforeCallback = (page: Page) => {
    if (isMobile) {
      page.getByRole('button', { name: 'General info' }).click();
    }
  };

  expect(await createContentType(page, "profile", { "First name": "John", "Last name": "Doe" }, beforeCallback)).toBe(true);
  expect(await page.title()).toBe("Edit layout for John Doe | YaleSites");
});
