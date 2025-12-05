import { expect, test } from "@playwright/test";
import { DEFAULT_VIS_REG_OPTIONS, TIMEOUTS } from "@support/testConfig";

export default async function visRegTests(
  options = DEFAULT_VIS_REG_OPTIONS,
  testName: string = "visual regression should match previous screenshot"
) {
  test.describe("visual regression", () => {
    test(testName, async ({ page }) => {
      // Wait for network to be idle
      await page.waitForLoadState('networkidle');

      // Wait for all images to load
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
          images
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
            }))
        );
      });

      // Wait for fonts to be ready
      await page.evaluate(() => document.fonts.ready);

      // Wait for any animations to complete
      await page.waitForTimeout(TIMEOUTS.ANIMATION);

      await expect(page).toHaveScreenshot(options);
    });
  });
}
