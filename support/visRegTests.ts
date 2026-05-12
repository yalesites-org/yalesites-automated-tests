import { expect, test } from "@playwright/test";
import { DEFAULT_VIS_REG_OPTIONS, TIMEOUTS } from "@support/testConfig";

export default async function visRegTests(
  options = DEFAULT_VIS_REG_OPTIONS,
  testName: string = "visual regression should match previous screenshot",
  maskSelectors: string[] = []
) {
  test.describe("visual regression", () => {
    test(testName, async ({ page }) => {
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.race([
          Promise.all(
            images
              .filter(img => !img.complete)
              .map(img => new Promise(resolve => {
                img.addEventListener("load", resolve);
                img.addEventListener("error", resolve);
              }))
          ),
          new Promise(resolve => setTimeout(resolve, 15000)),
        ]);
      });

      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(TIMEOUTS.ANIMATION);

      // Override overflow-x:hidden on html/body — a 2.22.0 CSS addition that causes
      // WebKit to skip painting off-screen tiles in fullPage screenshots.
      await page.addStyleTag({ content: "html, body { overflow-x: visible !important; }" });

      const mask = maskSelectors.map(selector => page.locator(selector));
      await expect(page).toHaveScreenshot(mask.length ? { ...options, mask } : options);
    });
  });
}
