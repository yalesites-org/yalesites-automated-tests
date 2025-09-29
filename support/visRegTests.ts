import { expect, test } from "@playwright/test";
import { DEFAULT_VIS_REG_OPTIONS } from "@support/testConfig";

export default async function visRegTests(
  options = DEFAULT_VIS_REG_OPTIONS,
  testName: string = "visual regression should match previous screenshot"
) {
  test.describe("visual regression", () => {
    test(testName, async ({ page }) => {
      await expect(page).toHaveScreenshot(options);
    });
  });
}
