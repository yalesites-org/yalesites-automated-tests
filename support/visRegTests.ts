import { expect, test } from "@playwright/test";

export default function visRegTests() {
    test.describe("visual regression", () => {
        test("should match previous screenshot", async ({ page }) => {
            await expect(page).toHaveScreenshot({ fullPage: true, maxDiffPixels: 100 });
        });
    });
}
