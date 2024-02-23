# YaleSites Automated Tests

### Local path

Set an environment variable named YALESITES_PROJECT_PATH to the absolute location of the yalesites repo you have running locally.

### Remote pantheon site

Set the YALESITES_PROJECT_PATH to the terminus server name to attempt to get admin credentials from.

## Usage

```bash
YALESITES_PROJECT_PATH="remotesite.dev" npm run test
```

or for a UI
```bash
YALESITES_PROJECT_PATH="remotesite.dev" npm run ui
```

or for debugging a test
```bash
YALESITES_PROJECT_PATH="remotesite.dev" npm run debug
```

### Developing new tests

If you prefer to run with the command line reporter, you can use the following:
```bash
YALESITES_PROJECT_PATH="remotesite.dev" npm run dev
```

The above command defaults to the line reporter.
