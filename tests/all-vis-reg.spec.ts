// This is an attempt to come up with a visual regression test utilizing Playwright Test
//  that can be used to compare a source (expected) website that is different from the
//  test (actual) website. The built-in `expect(page).toHaveScreenshot()` functionality
//  only works with the same base URL.

//  Unfortunately while the test below will fail a visual regression, it won't take
//  advantage of the nice GUI inspection of the failure in the HTML report that
//  Playwrigt Test otherwise provides if you use `toHaveScreenshot`
import { test, expect } from "@playwright/test";

/*
rm -rf test-results; rm -rf snapshots/all-vis-reg.spec.ts-snapshots; YALESITES_URL="https://dev-yalesites-mv482.pantheonsite.io" npx playwright test all-vis-reg.spec; YALESITES_URL="https://d10-yalesites-mv482.pantheonsite.io" npx playwright test all-vis-reg.spec; npx playwright show-report
*/

const testScreenshotForPage = (pagePath: string) => {
  // Sleep for 5 seconds to not bombard the server
  // setTimeout(() => {}, 5000);
  const subPath = "component-pages-for-e2e-testing"
  const url = `${process.env.YALESITES_URL || "http://yalesites-platform.lndo.site"}/${subPath}/${pagePath}`;
  return test(`should compare ${pagePath}`, async ({ page }) => {
    // await page.waitForTimeout(5000);
    await page.goto(url);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixelRatio: 0.17,
      animations: "disabled",
    });
  });
};

testScreenshotForPage("accordion");
testScreenshotForPage("action-banner");
testScreenshotForPage("button-link");
testScreenshotForPage("calendar-list");
testScreenshotForPage("callout");
testScreenshotForPage("content-spotlight");
testScreenshotForPage("custom-cards");
testScreenshotForPage("divider");
testScreenshotForPage("embed");
testScreenshotForPage("gallery");
testScreenshotForPage("grand-hero");
testScreenshotForPage("image");
testScreenshotForPage("media-grid");
testScreenshotForPage("post-feed");
testScreenshotForPage("pre-built-form");
testScreenshotForPage("quick-links");
testScreenshotForPage("quote");
testScreenshotForPage("tabs");
testScreenshotForPage("text");
testScreenshotForPage("video");
testScreenshotForPage("view");
testScreenshotForPage("wrapped-image");
