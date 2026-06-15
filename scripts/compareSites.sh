#!/bin/bash
#
# Visual regression A/B comparison between two live YaleSites environments.
# Captures a baseline from the first URL (the "released"/reference site), then
# diffs the second URL (the candidate) against it and opens the HTML report.
# Defaults to the dev (pre-release) vs v2230 visreg sandboxes.
#
# Usage:
#   ./scripts/compareSites.sh [baselineUrl] [candidateUrl] [--reuse-baseline]
#
#   --reuse-baseline   Skip recapturing the baseline if snapshots already exist
#                      locally (faster, but compares against whatever the
#                      baseline URL looked like last time it was captured).
#                      Default: always capture a fresh baseline.

set -euo pipefail

runTests() {
    # Pull out the optional --reuse-baseline flag from anywhere in the args.
    reuse_baseline=false
    positional=()
    for arg in "$@"; do
        if [ "$arg" = "--reuse-baseline" ]; then
            reuse_baseline=true
        else
            positional+=("$arg")
        fi
    done

    site1=${positional[0]:-"https://dev-ys-yalesites-visreg-yale-edu.pantheonsite.io"}
    site2=${positional[1]:-"https://v2230-ys-yalesites-visreg-yale-edu.pantheonsite.io"}

    # Pantheon sandboxes idle down; warm both before the measured run so the
    # first real navigations aren't cold.
    echo "Warming up sandboxes..."
    for site in "$site1" "$site2"; do
        curl -s -o /dev/null --max-time 90 "$site/component-pages-for-e2e-testing" || true
    done

    # The playwright runs are expected to exit non-zero: the candidate run fails
    # whenever it finds a visual diff (the whole point), and a page that won't
    # stabilize fails the baseline capture. Tolerate both so we still open the
    # report rather than aborting under `set -e`.
    if [ "$reuse_baseline" = true ]; then
        # No --update-snapshots: Playwright creates only missing baselines and
        # reuses any that already exist on disk.
        echo "Reusing existing baseline where present (capturing only missing): $site1"
        YALESITES_URL="$site1" npx playwright test all-vis-reg.spec --reporter=dot || true
    else
        echo "Capturing fresh baseline from: $site1"
        YALESITES_URL="$site1" npx playwright test all-vis-reg.spec --reporter=dot --update-snapshots || true
    fi

    echo "Comparing candidate against baseline: $site2"
    PLAYWRIGHT_JSON_OUTPUT_NAME="test-results.json" \
        YALESITES_URL="$site2" npx playwright test all-vis-reg.spec --reporter=html,json || true

    npx playwright show-report
}

runTests "$@"
