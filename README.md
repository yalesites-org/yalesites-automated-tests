# YaleSites Automated Tests

End to end testing for Yalesites Project.

## Installation

```bash
gh repo clone yale-org/yalesites-automated-tests
cd yalesites-automated-tests
npm i -D
npx playwright install
```

## Usage

```bash
YALESITES_URL="http://yalesites.domain" npm run test
```

or for a UI
```bash
YALESITES_URL="http://yalesites.domain" npm run ui
```

or for debugging a test
```bash
YALESITES_URL="http://yalesites.domain" npm run debug
```

### Command line reporter

If you prefer to run with the command line reporter while you develop, you can
use the following:
```bash
YALESITES_URL="http://yalesites.domain" npm run dev
```

The above command defaults to the line reporter over the HTML reporter.
