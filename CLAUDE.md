# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright end-to-end test suite for the YaleSites platform. Tests run against a live YaleSites
instance (Lando locally, or a Pantheon environment) — there is no app in this repo to build, only
tests that drive someone else's running site. Coverage is accessibility (axe-core), visual
regression (screenshot comparison), and functional/keyboard behavior of components.

## Architecture

- `tests/components/` — one spec per YaleSites component. Each hits `/component-pages-for-e2e-testing/[component]` on the target site.
- `tests/features/` — feature-level specs (search, link treatments).
- `tests/all-vis-reg.spec.ts` — **not** part of the normal suite's vis-reg. It is a standalone tool for comparing two *different* sites (see "Cross-site comparison" below).
- `support/` — shared helpers, imported via the `@support/*` path alias (`tsconfig.json` → `support/*`).
- `snapshots/` — baselines, one directory per spec file (`snapshots/components/[spec].spec.ts-snapshots/`), per browser project.

### Test composition

A component spec is: `beforeEach` setup → functional `test()`s → `a11yTests()` → `visRegTests()`.
The last two are factory functions that declare their own `test.describe` blocks, so calling them at
module scope is what registers the a11y and screenshot tests.

```typescript
import { test } from "@playwright/test";
import { expect } from "@support/axePage";           // extended expect, adds toPassAxe
import { pressKeyForBrowser, type PressKeyForBrowserFunction } from "@support/tabKey";
import { setupComponentPage, TIMEOUTS } from "@support/testConfig";
import a11yTests from "@support/a11yTests";
import visRegTests from "@support/visRegTests";

let pressTabKeyRepeatedly: PressKeyForBrowserFunction;
test.beforeEach(async ({ page, browserName, isMobile }) => {
  pressTabKeyRepeatedly = pressKeyForBrowser(browserName, isMobile);
  await setupComponentPage(page, "component-name");
});

test("has a heading", async ({ page }) => { /* ... */ });

a11yTests();
visRegTests();
```

### Support helpers

- `setupComponentPage(page, componentPath, loadState = "networkidle")` — navigates and waits for fonts. Pass `"load"` when a third-party iframe keeps a connection open and `networkidle` would hang (see `tests/components/embed.spec.ts`).
- `a11yTests(axeTags = DEFAULT_AXE_TAGS, testName = "should pass axe accessibility tests")`.
- `visRegTests(options = DEFAULT_VIS_REG_OPTIONS, testName?, maskSelectors: string[] = [])` — waits for images/fonts/animations, then `toHaveScreenshot`. Pass `maskSelectors` for third-party content that can't be stable: `visRegTests(undefined, undefined, ['iframe'])`.
- `pressKeyForBrowser(browserName, isMobile)` — returns a tab-press function. WebKit/Mobile Safari need `Alt+Tab` rather than `Tab` to move through links, and each browser has a different default tab count to reach the same element (`BROWSER_DEFAULTS` in `support/tabKey.ts`). Pass a number or a `TabCounts` map to override.
- `TIMEOUTS` in `support/testConfig.ts` — `ELEMENT_VISIBLE: 10000`, `USER_INTERACTION: 5000`, `NETWORK_REQUEST: 15000`, `ANIMATION: 5000`. Use these, not literals.
- `support/login.ts` — `getLoginUrl(path)` shells out to `lando drush uli` (local, cwd from `YALESITES_PROJECT_PATH`, default `../yalesites-project`) or `terminus drush <site.env> -- user:login` when the path looks like `*.dev`/`*.test`/`*.live`. For tests that need an authenticated session.
- `support/axePage.ts` — `AxePage` wrapper plus the `toPassAxe({ tags })` matcher with readable violation output. **All iframes are excluded from axe analysis** so reCAPTCHA doesn't produce violations we can't fix.

### Vis-reg test-name contract

Every npm vis-reg script selects tests with `--grep 'should match previous screenshot'`, and the
`Mobile Safari` project in `playwright.config.ts` has that same string as its `grep`. Do not rename
a vis-reg test out of that phrase — it silently drops out of every snapshot script and the mobile
project runs nothing.

## Commands

```bash
# Full suite against a target
YALESITES_URL="http://yalesites-mv482-dev.lndo.site" npm run test

npm run ui        # Playwright UI
npm run debug     # step through
npm run dev       # line reporter, fast feedback

# Single spec / single browser / pattern
npx playwright test tests/components/accordion.spec.ts
npx playwright test --project=chromium
npx playwright test --grep "accessibility"
```

Default target is `http://yalesites-platform.lndo.site` when `YALESITES_URL` is unset.

### Visual regression

```bash
# Capture baselines from the KNOWN-GOOD environment
YALESITES_URL="https://dev-ys-...pantheonsite.io" npm run update-snapshots

# Compare the CANDIDATE environment against those baselines
YALESITES_URL="https://v2220-ys-...pantheonsite.io" npm run vis-reg
```

Per-browser variants exist for both (`vis-reg:chromium|firefox|webkit|mobile`,
`update-snapshots:chromium|firefox|webkit|mobile`) — use them when only one browser is failing
rather than re-capturing all four.

Baselines are environment-specific: a snapshot captured on Lando will not match Pantheon. Capture
and compare from the same kind of environment.

### Cross-site comparison (`all-vis-reg.spec.ts`)

Playwright's `toHaveScreenshot` only compares against a stored baseline, not against another live
site. `scripts/compareSites.sh <siteA> <siteB>` works around that: it runs `all-vis-reg.spec` with
`--update-snapshots` on site A, then without on site B, and opens the report. Drawback noted in the
file: failures don't get the nice diff GUI. Its component list is hardcoded and separate from
`tests/components/` — adding a component test does not add it here.

## Configuration notes (`playwright.config.ts`)

- Timeout 120s per test, navigation timeout 60s — Drupal on Pantheon is slow.
- Workers: 1 on CI, 2 when `YALESITES_URL` contains `pantheonsite.io` (rate limiting), 4 otherwise.
- Retries: 2 on CI, 0 locally. Traces on first retry, screenshots on failure.
- `Mobile Safari` (iPhone 13 Mini) runs vis-reg only; functional/a11y tests run on the three desktop browsers.
- Snapshots redirected to `./snapshots` so they don't sit next to the specs.
- Axe tags (`DEFAULT_AXE_TAGS`): `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`.
- Vis-reg defaults (`DEFAULT_VIS_REG_OPTIONS`): `fullPage: true`, `maxDiffPixelRatio: 0.17`, `animations: "allow"`.

## Known rendering workarounds

`visRegTests` injects `html, body { overflow-x: visible !important; }` before screenshotting.
Platform CSS added `overflow-x: hidden` in 2.22.0, which triggers a WebKit compositing bug where
fullPage screenshots come back blank below the fold. Don't remove it without re-checking Mobile
Safari snapshots.

## Working here

- Never skip a test without verifying why. Every component should have coverage. Existing `test.skip` calls (keyboard-tab tests in `callout.spec.ts`, `button-link.spec.ts`) are known-flaky tab-count assertions, not permission to add more.
- Always give a runnable CLI command when reporting that a test change works.
- A screenshot diff is not automatically a test bug — it may be a real platform regression. Check the diff image in `playwright-report/` before reaching for `--update-snapshots`.
