import { test as base, expect } from "@playwright/test";
import { AxePage } from '@support/a11y-page';
import fs from "fs";

const axe_tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  // Uncomment to try WCAG 2.2 rules
  // "wcag22a",
  // "wcag22aa",
  "best-practice", // Common accessibility best practices
  // "ACT",             // W3C approved Accessibility Conformance Testing Rules
  // "experimental",    // Cutting-edge rules
];

export const test = base.extend<{ a11yPage: AxePage }>({
  a11yPage: async ({ page }, use) => {
    const a11y = new AxePage(page);
    await use(a11y);
  },
});

const links = fs
  .readFileSync("sitemap.links", "utf-8")
  .split("\n")
  .filter((link: string) => link !== "");

links.forEach((link: string) => {
  test(`Accessibility test for ${link}`, async ({ page, a11yPage }) => {
    await page.goto(link);
    await a11yPage.evaluate();
  });
});
