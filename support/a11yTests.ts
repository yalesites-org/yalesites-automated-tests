import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

export default function a11yTests() {
    test.describe("accessibility", () => {
        test("should pass axe", async ({ page }) => {
            const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
            expect(accessibilityScanResults.violations).toEqual([]);
        });
    });
}
