import { expect, test } from "@playwright/test";
import { DEFAULT_VIS_REG_OPTIONS } from "@support/testConfig";
import stabilizePage from "@support/stabilizePage";

export default async function visRegTests(
  options = DEFAULT_VIS_REG_OPTIONS,
  testName: string = "visual regression should match previous screenshot",
  maskSelectors: string[] = []
) {
  test.describe("visual regression", () => {
    test(testName, async ({ page }) => {
      await stabilizePage(page);

      const mask = maskSelectors.map(selector => page.locator(selector));
      await expect(page).toHaveScreenshot(mask.length ? { ...options, mask } : options);
    });
  });
}
