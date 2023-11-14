# YaleSites Automated Tests

## Admin test setup

To test as an admin, you'll need to either specify a local directory with yalesites or a remote pantheon location to test against.

### Local path

Set an environment variable named YALESITES_PROJECT_PATH to the absolute location of the yalesites repo you have running locally.

### Remote pantheon site

Set the YALESITES_PROJECT_PATH to the terminus server name to attempt to get admin credentials from.

## Usage

```bash
YALESITES_PROJECT_PATH="remotesite.dev" npx playwright test
```

or for a UI
```bash
YALESITES_PROJECT_PATH="remotesite.dev" npx playwright test --ui
```
