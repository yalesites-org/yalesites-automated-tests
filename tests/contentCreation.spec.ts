import { expect, test } from "@playwright/test";
import { createContentType } from "@support/drupalPage";

test.use({ storageState: 'playwright/.auth/siteAdmin.json' });

test("can create a new page", async ({ page }) => {
  expect(await createContentType(page, "page", { Title: "My new page", "Teaser Title": "Hi" })).toBe(true);
  expect(await page.title()).toBe("Edit layout for My new page | YaleSites");
});

test("can create a new event", async ({ page }) => {
  expect(await createContentType(page, "event", {
    Title: "My new event",
    "In-person": true,
    "#edit-field-event-date-0-time-wrapper-value-date": new Date(),
    "#edit-field-event-date-0-time-wrapper-value-time": "12:00 PM",
    "#edit-field-event-date-0-time-wrapper-end-value-date": new Date(),
    "#edit-field-event-date-0-time-wrapper-end-value-time": "3:00 PM",
  })).toBe(true);
  expect(await page.title()).toBe("Edit layout for My new event | YaleSites");
});
