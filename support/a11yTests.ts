import { test, type Page } from "@playwright/test";
import { expect } from "@support/axePage";
import { DEFAULT_AXE_TAGS } from "@support/testConfig";

export default async function a11yTests(
  axe_tags: string[] = DEFAULT_AXE_TAGS,
  testName: string = "should pass axe accessibility tests"
) {
  test.describe("accessibility", () => {
    test(testName, async ({ page }) => {
      await expect(page).toPassAxe({ tags: axe_tags });
    });
  });
}
