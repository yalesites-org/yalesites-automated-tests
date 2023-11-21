import { test } from "@playwright/test";
import { expect } from '@support/a11y-page';
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

const links = fs
  .readFileSync("sitemap.links", "utf-8")
  .split("\n")
  .filter((link: string) => link !== "");

links.forEach((link: string) => {
  test(`Accessibility test for ${link}`, async ({ page }) => {
    await page.goto(link);
    await expect(page).toPassAxe(axe_tags);
  });
});
