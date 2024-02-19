// This is an attempt to come up with a visual regression test utilizing Playwright Test
//  that can be used to compare a source (expected) website that is different from the
//  test (actual) website. The built-in `expect(page).toHaveScreenshot()` functionality
//  only works with the same base URL.

//  Unfortunately while the test below will fail a visual regression, it won't take
//  advantage of the nice GUI inspection of the failure in the HTML report that
//  Playwrigt Test otherwise provides if you use `toHaveScreenshot`
import { test, expect } from "@playwright/test";

/*
rm -rf test-results && rm -rf tests/mv482.vis.reg.spec.ts-snapshots && YALESITES_URL="https://dev-yalesites-mv482.pantheonsite.io" npx playwright test mv482.vis.reg.spec && \
 YALESITES_URL="https://d10-yalesites-mv482.pantheonsite.io" npx playwright test mv482.vis.reg.spec; npx playwright show-report
*/

const testScreenshotForPage = (pagePath: string) => {
  const url = `${process.env.YALESITES_URL || "http://yalesites-platform.lndo.site"}/${pagePath}`;
  return test(`should compare ${pagePath}`, async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 1000,
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
