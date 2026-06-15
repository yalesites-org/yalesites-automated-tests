import { Page } from "@playwright/test";
import { TIMEOUTS } from "@support/testConfig";

// Settle a page before taking a screenshot: wait for the network to go idle,
// for all images to finish, for fonts to be ready, and for animations to
// elapse. Also overrides overflow-x:hidden on html/body — a 2.22.0 CSS addition
// that causes WebKit to skip painting off-screen tiles in fullPage screenshots.
// Shared by the per-component vis-reg helper (visRegTests.ts) and the
// all-vis-reg A/B comparison spec.
export default async function stabilizePage(page: Page) {
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

  await page.addStyleTag({ content: "html, body { overflow-x: visible !important; }" });
}
