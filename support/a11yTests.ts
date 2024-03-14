import { test, type Page } from "@playwright/test";
import { expect } from "@support/axePage";

export default async function a11yTests(axe_tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]) {
    test.describe("accessibility", () => {
        test("should pass axe", async ({ page }) => {
            await expect(page).toPassAxe({ tags: axe_tags });
        });
    });
}
