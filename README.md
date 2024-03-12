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

#### Authentication

To use authentication in your tests, you'll need to follow the Playwright way
of doing this.  This is done by creating a new entry like this in your tests.
We recommend containing this inside of a describe block so that you can be
explicit about the type of auth you need and don't get mixed up.

For site admin roles:

```javascript
test.describe("as a site administrator", () => {
  test.use({ storageState: 'playwright/.auth/siteAdmin.json' });
});
```

For platform admin roles:

```javascript
test.describe("as a platform administrator", () => {
  test.use({ storageState: 'playwright/.auth/platformAdmin.json' });
});
```

By doing the above, all tests within the describe block will be as a user with
that role.
