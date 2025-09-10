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
│   └── all-vis-reg.spec.ts  # Consolidated visual regression tests
├── support/                 # Shared utilities and helpers
│   ├── axePage.ts           # Custom axe-core page extensions
│   ├── a11yTests.ts         # Accessibility testing utilities
│   ├── visRegTests.ts       # Visual regression testing utilities
│   ├── testConfig.ts        # Test configuration and setup
│   ├── tabKey.ts            # Cross-browser keyboard navigation
│   └── ...                  # Additional utilities
├── snapshots/               # Visual regression snapshots
└── playwright.config.ts     # Playwright configuration
```

## Prerequisites

- Node.js (version 16 or higher)
- npm
- Access to a YaleSites instance for testing

## Installation

```bash
gh repo clone yale-org/yalesites-automated-tests
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
- **Workers**: 1 worker (CI), 4 workers locally
- **Navigation Timeout**: 30 seconds for slow Drupal responses
- **Visual Diff Threshold**: 17% maximum pixel difference for screenshots

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

### Visual Regression Testing

Visual regression tests capture full-page screenshots and compare them across test runs with a maximum allowed pixel difference of 17%. Screenshots are captured for:
- Desktop browsers (Chromium, Firefox, WebKit)
- Mobile Safari (iPhone 13 Mini)

## Browser Support

Tests run across the following browser configurations:

- **Desktop Chrome** (Chromium)
- **Desktop Firefox**
- **Desktop Safari** (WebKit)
- **Mobile Safari** (iPhone 13 Mini)

## Utilities and Helpers

### Key Helper Functions

- `setupComponentPage(page, componentName)` - Navigate to component test pages
- `a11yTests()` - Run standardized accessibility test suite
- `visRegTests()` - Run visual regression test suite
- `pressKeyForBrowser()` - Cross-browser keyboard navigation testing
- `TIMEOUTS` - Centralized timeout configurations

### Component Test Pages

Tests target component demonstration pages at:
`/component-pages-for-e2e-testing/{component-name}`

## Snapshot Management

Visual regression snapshots are stored in the `./snapshots` directory, organized by:
- Test file name
- Browser/device configuration
- Operating system

To update snapshots after intentional visual changes:
```bash
npm run update-snapshots
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase navigation timeout for slow Drupal responses
2. **Visual Differences**: Check if changes are intentional, update snapshots if needed
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
