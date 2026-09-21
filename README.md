# YaleSites Automated Tests

Comprehensive end-to-end testing suite for the YaleSites Project using Playwright. This repository provides automated testing for YaleSites components with a focus on accessibility compliance, visual regression testing, and functional validation across multiple browsers and devices.

## Features

- **Accessibility Testing**: WCAG 2.0/2.1 AA compliance validation using @axe-core/playwright
- **Visual Regression Testing**: Cross-browser screenshot comparison with configurable pixel difference thresholds
- **Multi-Browser Support**: Tests run across Chromium, Firefox, WebKit, and Mobile Safari
- **Component-Specific Testing**: Individual test suites for each YaleSites component
- **Feature Testing**: End-to-end validation of site features like search and link treatments
- **Parallel Execution**: Tests run in parallel for improved performance

## Project Structure

```
├── tests/
│   ├── components/          # Component-specific test suites
│   │   ├── accordion.spec.ts
│   │   ├── action_banner.spec.ts
│   │   ├── button-link.spec.ts
│   │   └── ...              # Additional component tests
│   ├── features/            # Feature-level test suites
│   │   ├── search.spec.ts
│   │   └── link-treatments.spec.ts
│   └── all-vis-reg.spec.ts  # Standalone two-site comparison tool (see below)
├── support/                 # Shared utilities and helpers
│   ├── axePage.ts           # Custom axe-core page extensions
│   ├── a11yTests.ts         # Accessibility testing utilities
│   ├── visRegTests.ts       # Visual regression testing utilities
│   ├── testConfig.ts        # Test configuration and setup
│   ├── tabKey.ts            # Cross-browser keyboard navigation
│   └── ...                  # Additional utilities
├── scripts/                 # compareSites.sh — two-site vis-reg runner
├── snapshots/               # Visual regression baselines
└── playwright.config.ts     # Playwright configuration
```

## Prerequisites

- Node.js 18 or higher (required by Playwright 1.60)
- npm
- Access to a YaleSites instance for testing

## Installation

```bash
gh repo clone yalesites-org/yalesites-automated-tests
cd yalesites-automated-tests
npm install
npx playwright install
```

## Configuration

### Environment Variables

Set the target YaleSites URL using the `YALESITES_URL` environment variable:

```bash
export YALESITES_URL="http://yalesites.domain"
```

If not specified, tests default to `http://yalesites-platform.lndo.site`.

### Test Configuration

Key configuration options in `playwright.config.ts`:

- **Timeout**: 120 seconds per test
- **Retries**: 2 attempts on failure (CI), 0 locally
- **Workers**: 1 on CI, 2 when `YALESITES_URL` points at `pantheonsite.io` (avoids rate limiting), 4 otherwise
- **Navigation Timeout**: 60 seconds for slow Drupal responses
- **Visual Diff Threshold**: 17% maximum pixel difference for screenshots
- **Mobile Safari**: vis-reg only — functional and accessibility tests run on the three desktop browsers

## Usage

### Basic Test Execution

```bash
# Run all tests with environment variable
YALESITES_URL="http://yalesites.domain" npm run test

# Run tests with UI interface
YALESITES_URL="http://yalesites.domain" npm run ui

# Debug mode (step through tests)
YALESITES_URL="http://yalesites.domain" npm run debug

# Development mode with line reporter
YALESITES_URL="http://yalesites.domain" npm run dev

# Update visual regression snapshots
YALESITES_URL="http://yalesites.domain" npm run update-snapshots
```

### Visual Regression Runs

Snapshot baselines are captured from a known-good environment, then the candidate environment is
compared against them:

```bash
# 1. Capture baselines from the known-good environment
YALESITES_URL="https://dev-ys-yalesites-visreg-yale-edu.pantheonsite.io" npm run update-snapshots

# 2. Compare the candidate environment against those baselines
YALESITES_URL="https://v2220-ys-yalesites-visreg-yale-edu.pantheonsite.io" npm run vis-reg
```

Both have per-browser variants — use them when only one browser is failing instead of recapturing
all four:

```bash
npm run vis-reg:chromium          # also :firefox, :webkit, :mobile
npm run update-snapshots:webkit   # same four suffixes
npm run vis-reg:json              # JSON reporter, for diffing runs programmatically
```

Baselines are environment-specific. A snapshot captured on Lando will not match Pantheon — capture
and compare from the same kind of environment.

### Comparing Two Live Sites

Playwright's `toHaveScreenshot` can only compare against a stored baseline, not against another
live site. `tests/all-vis-reg.spec.ts` plus `scripts/compareSites.sh` work around that by capturing
site A as the baseline and immediately running site B against it:

```bash
./scripts/compareSites.sh https://old-site.pantheonsite.io https://new-site.pantheonsite.io
```

Failures show as plain diffs rather than in the report's comparison GUI. The component list in
`all-vis-reg.spec.ts` is hardcoded and separate from `tests/components/`, so adding a component
test does not add it here.

### Running Specific Tests

```bash
# Run tests for a specific component
npx playwright test tests/components/accordion.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium

# Run tests with specific tag
npx playwright test --grep "accessibility"
```

## Test Types

### Component Tests

Each YaleSites component has a dedicated test suite that typically includes:

1. **Functional Tests**: Component behavior and interactions
2. **Accessibility Tests**: WCAG compliance using axe-core
3. **Visual Regression Tests**: Screenshot comparison across browsers
4. **Keyboard Navigation Tests**: Tab order and keyboard accessibility

Example test structure:
```typescript
test.beforeEach(async ({ page }) => {
  await setupComponentPage(page, "accordion");
});

test("functional behavior", async ({ page }) => {
  // Component interaction tests
});

a11yTests(); // Accessibility test suite
visRegTests(); // Visual regression test suite
```

### Accessibility Testing

Accessibility tests use axe-core with the following default rule sets:
- `wcag2a`, `wcag2aa` - WCAG 2.0 Level A/AA
- `wcag21a`, `wcag21aa` - WCAG 2.1 Level A/AA
- `best-practice` - Axe best practices

All iframes are excluded from axe analysis (in the `AxePage` wrapper) so embedded third-party
content such as reCAPTCHA doesn't report violations this project can't fix.

### Visual Regression Testing

Visual regression tests capture full-page screenshots and compare them against stored baselines with a maximum allowed pixel difference of 17%. Screenshots are captured for:
- Desktop browsers (Chromium, Firefox, WebKit)
- Mobile Safari (iPhone 13 Mini)

Every vis-reg npm script selects tests with `--grep 'should match previous screenshot'`, and the
Mobile Safari project uses the same string as its `grep`. Keep that phrase in any vis-reg test name
— renaming past it silently drops the test from every snapshot script and leaves the mobile project
with nothing to run.

Third-party content that can't render consistently is masked out of the screenshot by passing
selectors as the third argument, e.g. `visRegTests(undefined, undefined, ['iframe'])` in
`tests/components/embed.spec.ts`.

`visRegTests` also injects `html, body { overflow-x: visible !important; }` before capturing.
Platform CSS added `overflow-x: hidden` in 2.22.0, which triggers a WebKit compositing bug that
returns fullPage screenshots blank below the fold. Removing it requires re-checking Mobile Safari
snapshots.

## Browser Support

Tests run across the following browser configurations:

- **Desktop Chrome** (Chromium)
- **Desktop Firefox**
- **Desktop Safari** (WebKit)
- **Mobile Safari** (iPhone 13 Mini)

## Utilities and Helpers

### Key Helper Functions

- `setupComponentPage(page, componentPath, loadState = "networkidle")` - Navigate to a component test page and wait for fonts. Pass `"load"` when a third-party iframe holds a connection open and `networkidle` would hang.
- `a11yTests(axeTags?, testName?)` - Run the standardized accessibility test suite
- `visRegTests(options?, testName?, maskSelectors?)` - Run the visual regression test suite
- `pressKeyForBrowser(browserName, isMobile)` - Returns a tab-press function. WebKit and Mobile Safari need `Alt+Tab` rather than `Tab` to move through links, and each browser needs a different number of presses to reach the same element (`BROWSER_DEFAULTS` in `support/tabKey.ts`).
- `getLoginUrl(path)` - One-time login URL via `lando drush uli` locally, or `terminus drush <site.env> -- user:login` when the path looks like `*.dev`/`*.test`/`*.live`. Local path comes from `YALESITES_PROJECT_PATH`, defaulting to `../yalesites-project`.
- `TIMEOUTS` - Centralized timeouts: `ELEMENT_VISIBLE` 10s, `USER_INTERACTION` 5s, `NETWORK_REQUEST` 15s, `ANIMATION` 5s

Helpers are imported through the `@support/*` path alias defined in `tsconfig.json`.

### Component Test Pages

Tests target component demonstration pages at:
`/component-pages-for-e2e-testing/{component-name}`

## Snapshot Management

Visual regression baselines are stored outside the test folders, in `./snapshots`, one directory
per spec file (`snapshots/components/[name].spec.ts-snapshots/`), with a file per browser/device and
platform.

To update snapshots after intentional visual changes:
```bash
npm run update-snapshots
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase navigation timeout for slow Drupal responses
2. **Visual Differences**: A diff may be a real platform regression, not a stale baseline. Look at the diff image in `playwright-report/` before reaching for `--update-snapshots`
3. **Accessibility Failures**: Review axe-core violations and fix underlying issues
4. **Browser-Specific Failures**: Check for cross-browser compatibility issues

### Debug Mode

Use debug mode to step through tests interactively:
```bash
YALESITES_URL="http://yalesites.domain" npm run debug
```

### Test Reports

HTML reports are generated after test runs and saved to `playwright-report/`. Open `index.html` in a browser to view detailed results including:
- Test execution timeline
- Screenshots of failures
- Trace files for debugging
- Accessibility violation details

## Contributing

When adding new tests:

1. Follow existing patterns for component tests
2. Include accessibility and visual regression tests
3. Use the shared utilities in the `support/` directory
4. Update snapshots when visual changes are intentional
5. Ensure tests target the appropriate component test pages

## CI/CD Integration

The test suite is configured for CI environments with:
- Single worker to reduce database contention
- Automatic retries on failure
- HTML report generation
- Trace collection on failures
