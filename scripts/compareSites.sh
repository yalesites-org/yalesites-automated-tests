#!/bin/bash

rm -rf playwright-report
rm -rf tests-results
rm -rf snapshots/all-vis-reg.spec.ts-snapshots
YALESITES_URL="https://dev-yalesites-mv482.pantheonsite.io" npx playwright test all-vis-reg.spec --reporter=dot
YALESITES_URL="https://d10-yalesites-mv482.pantheonsite.io" npx playwright test all-vis-reg.spec --reporter=html
npx playwright show-report
