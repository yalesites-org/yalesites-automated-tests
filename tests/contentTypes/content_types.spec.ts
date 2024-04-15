import { test } from "@playwright/test";
import { expect } from "@support/axePage";

const runTests = () => {
  test("Create a new page content type", async ({ page }) => {
    await page.goto("/node/add/page");

    await page.getByLabel('Title', { exact: true }).fill('Test page');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(await page.title()).toContain("Edit layout for Test page");
  });

  test("Create a new post content type", async ({ page }) => {
    await page.goto("/node/add/post");

    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Post');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(await page.title()).toContain("Edit layout for Test Post");
  });

  test("Create a new event content type", async ({ page }) => {
    await page.goto("/node/add/event");

    await page.getByRole('textbox', { name: 'Title *' }).fill('Test Event');
    await page.getByLabel('In-person').check();
    await page.locator('#edit-field-event-date-0-time-wrapper-value-date').press('ArrowLeft');
    await page.locator('#edit-field-event-date-0-time-wrapper-value-date').press('ArrowLeft');
    await page.locator('#edit-field-event-date-0-time-wrapper-value-date').fill('2020-01-01');
    await page.locator('#edit-field-event-date-0-time-wrapper-value-date').press('Tab');
    await page.locator('#edit-field-event-date-0-time-wrapper-value-time').fill('17:00');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(await page.title()).toContain("Edit layout for Test Event");
  });

  test("Create a new profile content type", async ({ page, isMobile }) => {
    await page.goto("/node/add/profile");

    if (isMobile) {
      await page.getByRole('button', { name: 'General info' }).click();
    }

    await page.getByLabel('First Name', { exact: true }).fill('Test');
    await page.getByLabel('Last Name', { exact: true }).fill('User');
    await page.getByRole('button', { name: 'Save' }).click();

    expect(await page.title()).toContain("Edit layout for Test User");
  });
};

test.describe("as a site administrator", () => {
  test.use({ storageState: 'playwright/.auth/siteAdmin.json' });
  runTests();
});

test.describe("as a platform administrator", () => {
  test.use({ storageState: 'playwright/.auth/platformAdmin.json' });
  runTests();
});
