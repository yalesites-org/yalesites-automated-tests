export const DEFAULT_AXE_TAGS = [
  "wcag2a",
  "wcag2aa", 
  "wcag21a",
  "wcag21aa",
  "best-practice"
];

export const DEFAULT_VIS_REG_OPTIONS = {
  fullPage: true,
  maxDiffPixelRatio: 0.17
};

export const COMPONENT_TEST_BASE_URL = "/component-pages-for-e2e-testing";

/**
 * Standard timeout values for different types of operations
 */
export const TIMEOUTS = {
  ELEMENT_VISIBLE: 10000,
  USER_INTERACTION: 5000,
  NETWORK_REQUEST: 15000,
  ANIMATION: 3000
} as const;

/**
 * Standardized page setup for component tests - matches original pattern
 */
export async function setupComponentPage(page: any, componentPath: string) {
  await page.goto(`${COMPONENT_TEST_BASE_URL}/${componentPath}`);
  await page.waitForLoadState("load");
}