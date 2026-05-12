export const DEFAULT_AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "best-practice"
];

export const DEFAULT_VIS_REG_OPTIONS = {
  fullPage: true,
  maxDiffPixelRatio: 0.17,
  animations: "allow" as const,
};

export const COMPONENT_TEST_BASE_URL = "/component-pages-for-e2e-testing";

export const TIMEOUTS = {
  ELEMENT_VISIBLE: 10000,
  USER_INTERACTION: 5000,
  NETWORK_REQUEST: 15000,
  ANIMATION: 5000,
} as const;

export async function setupComponentPage(
  page: any,
  componentPath: string,
  loadState: "networkidle" | "load" | "domcontentloaded" = "networkidle"
) {
  await page.goto(`${COMPONENT_TEST_BASE_URL}/${componentPath}`);
  await page.waitForLoadState(loadState);
  await page.evaluate(() => document.fonts.ready);
}
