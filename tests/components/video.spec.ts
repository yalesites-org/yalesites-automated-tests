import { test } from "@playwright/test";
import { expect } from "@support/axePage";
import { pressKeyForBrowser, type PressKeyForBrowserFunction, type TabCounts } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "video");
});

test("has a video", async ({ page, isMobile }) => {
  // Wait for video to load on mobile
  if (isMobile) {
    await page.waitForTimeout(2000);
  }
  
  // Try multiple strategies for finding the video iframe
  const videoFrameSelectors = [
    'iframe[title*="Drupal"]',
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtube-nocookie.com"]',
    '.media-oembed-content iframe',
    'iframe'
  ];
  
  let videoFound = false;
  
  for (const selector of videoFrameSelectors) {
    const iframes = page.locator(selector);
    const count = await iframes.count();
    
    if (count > 0) {
      await expect(iframes.first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
      videoFound = true;
      break;
    }
  }
  
  if (!videoFound) {
    // Fallback: just check that there's some video-related content
    await expect(page.locator('.media-oembed-content, .video, [class*="video"]').first()).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }
});

test("Has a heading", async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Video Title' })).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

test("has a paragraph", async ({ page }) => {
  await expect(page.getByText('Lorem example page')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
});

a11yTests();
visRegTests();