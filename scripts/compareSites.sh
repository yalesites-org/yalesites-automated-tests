#!/bin/bash

runTests() {
    site1=${1:-"https://dev-yalesites-mv482.pantheonsite.io"}
    site2=${2:-"https://d10-yalesites-mv482.pantheonsite.io"}

    YALESITES_URL="$site1" npx playwright test all-vis-reg.spec --reporter=dot --update-snapshots
    YALESITES_URL="$site2" npx playwright test all-vis-reg.spec --reporter=html
    npx playwright show-report
}

runTests "$@"
