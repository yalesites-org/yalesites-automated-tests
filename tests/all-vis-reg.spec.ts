// Visual regression A/B comparison between two live YaleSites environments.
// The built-in `expect(page).toHaveScreenshot()` only diffs against a stored
// baseline, so the workflow is: capture the baseline from the currently-released
// site with `--update-snapshots`, then run again against the candidate site to
// diff. See scripts/compareSites.sh for the wrapper.
//
// Example:
//   rm -rf test-results snapshots/all-vis-reg.spec.ts-snapshots
//   YALESITES_URL="https://dev-ys-yalesites-visreg-yale-edu.pantheonsite.io"  npx playwright test all-vis-reg.spec --update-snapshots
//   YALESITES_URL="https://v2230-ys-yalesites-visreg-yale-edu.pantheonsite.io" npx playwright test all-vis-reg.spec --reporter=html,json
//   npx playwright show-report
import { test, expect } from "@playwright/test";
import stabilizePage from "@support/stabilizePage";

const testScreenshotForPage = (pagePath: string) => {
  const subPath = "component-pages-for-e2e-testing";
  const base = process.env.YALESITES_URL || "http://yalesites-platform.lndo.site";
  const url = `${base}/${subPath}/${pagePath}`;

  return test(`should compare ${pagePath}`, async ({ page }) => {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Settle the page (network, images, fonts, animations) before capturing —
    // Pantheon sandboxes are slow to warm up, so screenshots can be partial.
    await stabilizePage(page);

    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Strict: surface any meaningful visual delta for manual triage rather than
      // silently passing changes under a loose release-gate threshold.
      maxDiffPixelRatio: 0.001,
      animations: "disabled",
      // Give slow-loading Pantheon images time to settle so the stabilization
      // step can capture two consecutive identical frames (default 5s is too
      // short for image-heavy pages like the view/event listing on WebKit).
      timeout: 20000,
    });
  });
};

// The 30 component test pages exposed under /component-pages-for-e2e-testing/
// on both the dev and v2230 environments. Keep this list in sync with the
// sitemap if components are added or renamed.
testScreenshotForPage("accordion");
testScreenshotForPage("action-banner");
testScreenshotForPage("button-link");
testScreenshotForPage("calendar-list");
testScreenshotForPage("callout");
testScreenshotForPage("custom-cards");
testScreenshotForPage("directory");
testScreenshotForPage("divider");
testScreenshotForPage("embed");
testScreenshotForPage("facts-and-figures");
testScreenshotForPage("gallery");
testScreenshotForPage("grand-hero");
testScreenshotForPage("image");
testScreenshotForPage("image-banner");
testScreenshotForPage("in-line-message");
testScreenshotForPage("link-grid");
testScreenshotForPage("media-grid");
testScreenshotForPage("post-feed");
testScreenshotForPage("pre-built-form");
testScreenshotForPage("quick-links");
testScreenshotForPage("quote");
testScreenshotForPage("quote-callout");
testScreenshotForPage("spotlight-landscape");
testScreenshotForPage("spotlight-portrait");
testScreenshotForPage("tabs");
testScreenshotForPage("text");
testScreenshotForPage("tiles");
testScreenshotForPage("video");
testScreenshotForPage("view");
testScreenshotForPage("wrapped-image");
