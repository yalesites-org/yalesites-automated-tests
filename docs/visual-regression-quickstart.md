# Visual Regression Testing - Quick Start Guide

## For New Team Members

### First Time Setup

1. **Install Git LFS**:
   ```bash
   # macOS
   brew install git-lfs

   # Ubuntu/Debian
   sudo apt-get install git-lfs

   # Windows
   # Download from https://git-lfs.github.com/
   ```

2. **Clone and setup**:
   ```bash
   git clone <repo-url>
   cd yalesites-automated-tests
   git lfs install
   git lfs pull  # Downloads all snapshots (~178 MB)
   npm install
   npx playwright install
   ```

## Common Workflows

### Running Tests Locally

```bash
# Run all tests
YALESITES_URL="http://your-test-url" npm run test

# Run specific component
npx playwright test tests/components/accordion.spec.ts

# Run with UI for debugging
YALESITES_URL="http://your-test-url" npm run ui
```

### When Visual Regression Tests Fail in CI

1. **Check your PR** - Look for the bot comment with workflow link
2. **Download the report**:
   - Click workflow link → Scroll to Artifacts → Download `playwright-report-merged`
   - Unzip and open `index.html`
3. **Review the diffs** - Use the comparison slider to see differences
4. **Decide**:
   - 🐛 **Bug?** → Fix code and push
   - ✅ **Intentional?** → Update snapshots (see below)

### Updating Snapshots After Intentional Changes

**Always use Docker to match CI environment:**

```bash
# Run the snapshot regeneration script
YALESITES_URL="http://your-test-url" ./scripts/regenerate-snapshots-docker.sh

# Review the changes
git status
# Look at a few snapshots to ensure they look correct

# Commit and push
git add snapshots/
git commit -m "chore(snapshots): update visual regression baselines"
git push
```

**Why Docker?** CI runs on Linux, your Mac runs on darwin. Docker ensures snapshots match exactly.

### Testing Different Browsers in CI

By default, CI only tests Chromium (for speed). To test other browsers:

1. Go to **Actions** tab on GitHub
2. Click **Visual Regression Tests** workflow
3. Click **Run workflow** button
4. Select browser dropdown:
   - `chromium` (default, fastest)
   - `firefox`
   - `webkit`
   - `mobile-safari`
   - `all` (tests all 4 browsers, takes longer)
5. Click **Run workflow**

## Troubleshooting

### "Git LFS bandwidth limit exceeded"

**What happened**: You've downloaded >1 GB of LFS data this month

**Solutions**:
1. **Wait** - Resets at start of next billing cycle
2. **Purchase data pack** - $5/month for 50 GB at github.com/settings/billing
3. **Contact team lead** - They may have organization billing

**Note**: GitHub warns you before blocking, and never auto-charges.

### "Snapshots don't match in CI but pass locally"

**Cause**: Platform differences (macOS vs Linux rendering)

**Fix**: Always regenerate snapshots using Docker:
```bash
YALESITES_URL="http://your-test-url" ./scripts/regenerate-snapshots-docker.sh
```

### "Docker command not found"

**Fix**: Install Docker Desktop:
- macOS: https://docs.docker.com/desktop/mac/install/
- Windows: https://docs.docker.com/desktop/windows/install/
- Linux: https://docs.docker.com/engine/install/

### "Tests timing out in CI"

**Causes**:
- Test site is slow/unreachable
- Check `YALESITES_TEST_URL` secret is set correctly

**Fix**:
1. Verify test URL is accessible
2. Check GitHub repository secrets settings

## Quick Reference Commands

```bash
# Setup (first time)
git lfs install && git lfs pull

# Run all tests
YALESITES_URL="http://test-url" npm run test

# Update snapshots (Docker - matches CI)
YALESITES_URL="http://test-url" ./scripts/regenerate-snapshots-docker.sh

# Update snapshots (local - may differ from CI)
YALESITES_URL="http://test-url" npm run update-snapshots

# Check LFS status
git lfs ls-files

# Pull latest LFS files
git lfs pull
```

## Understanding the CI Workflow

### What Happens on Every PR:

1. ✅ GitHub Actions triggers visual regression workflow
2. 🐳 Spins up Docker container (Linux environment)
3. 🎯 Runs tests against Chromium only (default)
4. ⚡ Splits into 4 parallel shards (~8 min total)
5. 📊 Uploads merged HTML report as artifact
6. 💬 Bot comments on PR with instructions

### What Gets Tested:

- **Default**: Chromium only (fast feedback)
- **Manual**: Any browser or all browsers (via workflow dispatch)
- **Tests**: All 89 component/feature test scenarios
- **Snapshots**: Compares against Linux baselines in Git LFS

## Best Practices

1. ✅ **Always regenerate snapshots in Docker** before committing
2. ✅ **Review diffs carefully** - make sure changes are intentional
3. ✅ **Test locally first** to reduce CI usage
4. ✅ **Keep snapshot updates in separate commits** for clarity
5. ✅ **Monitor LFS bandwidth** occasionally at github.com/settings/billing

## Need More Help?

- **Full docs**: See README.md
- **Reverting LFS**: See docs/reverting-git-lfs.md
- **Playwright docs**: https://playwright.dev/
- **Git LFS docs**: https://git-lfs.github.com/
