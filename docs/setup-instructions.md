# Setup Instructions for Visual Regression CI

This guide walks you through the complete setup process for Git LFS and visual regression CI.

## Prerequisites Check

Before starting, ensure you have:

- [ ] Git LFS installed locally
- [ ] Docker installed (for snapshot regeneration)
- [ ] Write access to the repository
- [ ] Ability to force-push (for LFS migration)
- [ ] Team coordination (migration rewrites history)

## Part 1: Git LFS Setup and Migration

### Step 1: Verify Git LFS Installation

```bash
# Check if git-lfs is installed
git lfs version

# Should output something like: git-lfs/3.x.x
```

If not installed:
```bash
# macOS
brew install git-lfs

# Ubuntu/Debian
sudo apt-get install git-lfs

# Windows - download from https://git-lfs.github.com/
```

### Step 2: Review Current Repository State

```bash
# Check current repository size
du -sh .git

# Check snapshot size
du -sh snapshots/

# Check for uncommitted changes
git status
```

**Important**: Commit or stash any uncommitted changes before proceeding.

### Step 3: Coordinate with Team

⚠️ **Important**: The LFS migration rewrites git history. Coordinate with your team:

1. Announce migration time window (maintenance window)
2. Ask team to commit/push all work
3. Ask team to avoid pushing during migration
4. Schedule migration for low-activity time

### Step 4: Run LFS Setup Script

The `.gitattributes` file is already created. Now run the setup script:

```bash
# From repository root
./scripts/setup-lfs.sh
```

This script will:
1. Initialize Git LFS in the repo
2. Verify .gitattributes exists
3. Prompt for confirmation
4. Migrate all snapshots to LFS
5. Show repository size improvement

**Expected output**:
```
🔧 Setting up Git LFS for visual regression snapshots...
📦 Initializing Git LFS...
✅ Git LFS initialized successfully

📊 Current snapshot status:
178M    snapshots/

🔄 Migrating existing snapshots to Git LFS...
⚠️  This will rewrite git history. Make sure you have committed all changes first!

Continue with migration? (y/N): y

🚀 Starting migration (this may take a few minutes)...
migrate: Sorting commits: ..., done.
migrate: Rewriting commits: 100% (X/X), done.
...

✅ Migration complete!
```

### Step 5: Verify LFS Migration

```bash
# Check that snapshots are in LFS
git lfs ls-files

# Should show all PNG files
# Example output:
# abc123def4 * snapshots/tests/components/accordion.spec.ts-snapshots/chromium-linux.png

# Check repository size (should be smaller)
git count-objects -vH

# Verify a snapshot file shows LFS pointer
head -1 snapshots/tests/components/accordion.spec.ts-snapshots/chromium-darwin.png
# Should output: version https://git-lfs.github.com/spec/v1
```

### Step 6: Force Push to Remote

⚠️ **Warning**: This rewrites remote history. Ensure team is ready.

```bash
# Force push with lease (safer than --force)
git push --force-with-lease origin main

# If you have other branches with snapshots, update them too:
git push --force-with-lease origin --all
```

### Step 7: Team Members Update Their Clones

After you force-push, all team members need to update:

**Send this to your team:**

```
📣 Repository Update Required

The repository now uses Git LFS for snapshot storage. Please run these commands:

# 1. Install Git LFS (if not already installed)
brew install git-lfs  # macOS
# or download from https://git-lfs.github.com/

# 2. Update your local repository
git fetch origin
git reset --hard origin/main  # ⚠️ Discards local changes!

# 3. Initialize LFS and download snapshots
git lfs install
git lfs pull

# 4. Verify
git lfs ls-files  # Should show all snapshot files
```

## Part 2: Regenerate Snapshots for Linux

Now that LFS is set up, regenerate all snapshots to match the CI environment.

### Step 1: Ensure Docker is Running

```bash
# Check Docker
docker info

# If not running, start Docker Desktop
```

### Step 2: Set Test URL

```bash
# Set the YaleSites test instance URL
export YALESITES_URL="http://your-test-site-url"
```

### Step 3: Run Snapshot Regeneration

```bash
# From repository root
YALESITES_URL="http://your-test-url" ./scripts/regenerate-snapshots-docker.sh
```

This script will:
1. Check Docker is running
2. Backup existing snapshots to `snapshots-backup/`
3. Remove old snapshots
4. Generate new snapshots in Docker (Linux)
5. Verify Linux naming convention

**Expected duration**: 30-60 minutes depending on network speed

**Expected output**:
```
🐳 Regenerating visual regression snapshots in Docker...
📍 Test URL: http://your-test-site-url

⚠️  This will replace all existing snapshots with Linux-compatible versions
⚠️  Current snapshots directory will be backed up to snapshots-backup/

Continue? (y/N): y

💾 Backing up existing snapshots...
✅ Backup created at snapshots-backup/

🗑️  Removing old snapshots...

🚀 Running snapshot generation in Docker...
   This may take 30-60 minutes depending on your connection to the test site

[Playwright test output...]

✅ Snapshot regeneration complete!

📊 New snapshot stats:
178M    snapshots/
File count: 356 PNG files

✅ Snapshots are using Linux naming convention
```

### Step 4: Verify New Snapshots

```bash
# Check a few snapshots to ensure they look correct
open snapshots/tests/components/accordion.spec.ts-snapshots/chromium-linux.png

# Run tests to verify they pass
YALESITES_URL="http://your-test-url" npm run test -- --project=chromium
```

### Step 5: Commit New Snapshots

```bash
# Add all new snapshots
git add snapshots/

# Check what changed
git status
# Should show ~356 modified PNG files

# Commit
git commit -m "chore(snapshots): regenerate for Linux CI compatibility"

# Push
git push
```

## Part 3: Configure GitHub Repository

### Step 1: Set Repository Secret

The workflow needs a test URL. Set it as a repository secret:

1. Go to **GitHub repository** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `YALESITES_TEST_URL`
4. Value: `http://your-test-site-url` (your Drupal test instance)
5. Click **Add secret**

### Step 2: Enable GitHub Actions

If not already enabled:

1. Go to **Settings** → **Actions** → **General**
2. Ensure **Allow all actions** is selected
3. Set workflow permissions to **Read and write permissions**
4. Click **Save**

### Step 3: Enable Git LFS in Actions

The workflow already includes `lfs: true` in checkout step, but verify:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Git LFS**
3. Ensure it's enabled (should be by default)

## Part 4: Test the Workflow

### Step 1: Create a Test PR

```bash
# Create a test branch
git checkout -b test-visual-regression-ci

# Make a small change (e.g., update README)
echo "\n<!-- Test -->" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger visual regression CI"
git push -u origin test-visual-regression-ci
```

### Step 2: Open PR and Watch

1. Go to GitHub and create a PR from `test-visual-regression-ci` → `main`
2. Watch the **Checks** tab
3. Should see "Visual Regression Tests" running

### Step 3: Review Results

After ~8-10 minutes:

1. Check for bot comment on PR
2. Click workflow link
3. Scroll to **Artifacts**
4. Download `playwright-report-merged`
5. Unzip and open `index.html`
6. Verify report looks good

### Step 4: Clean Up Test PR

If everything works:
```bash
# Close and delete test PR on GitHub
# Then locally:
git checkout main
git branch -D test-visual-regression-ci
```

## Part 5: Monitor Git LFS Usage

### Set Up Billing Alerts

1. Go to https://github.com/settings/billing
2. Navigate to **Git LFS Data** section
3. View current usage (should be ~178 MB storage)
4. Enable email notifications for quota warnings

### Monthly Monitoring

Check monthly:
```bash
# View LFS usage locally
git lfs ls-files | wc -l  # File count
du -sh .git/lfs            # Local LFS cache size
```

Online:
- Visit https://github.com/settings/billing
- Check **Git LFS Data** → **Current usage**
- Look for:
  - Storage: ~178 MB / 1 GB (should be ~18%)
  - Bandwidth: varies by team activity

## Troubleshooting

### Migration Script Fails

**Error**: `git-lfs not found`
**Fix**: Install Git LFS (see Step 1)

**Error**: `uncommitted changes`
**Fix**: Commit or stash changes first

### Snapshot Regeneration Fails

**Error**: `Docker not running`
**Fix**: Start Docker Desktop

**Error**: `Cannot connect to YALESITES_URL`
**Fix**: Verify URL is accessible, check network/VPN

### CI Workflow Fails

**Error**: `Error: batch response: This repository is over its data quota`
**Fix**:
1. Check https://github.com/settings/billing
2. Either wait for reset or purchase data pack
3. See docs/reverting-git-lfs.md to disable LFS

**Error**: `YALESITES_TEST_URL not set`
**Fix**: Add repository secret (see Part 3, Step 1)

## Rollback Plan

If anything goes wrong and you need to rollback:

```bash
# Restore from backup (before pushing)
rm -rf snapshots
mv snapshots-backup snapshots

# If already pushed, reset to before migration
git log --oneline  # Find commit before migration
git reset --hard <commit-hash>
git push --force-with-lease
```

To completely remove LFS, see [docs/reverting-git-lfs.md](reverting-git-lfs.md).

## Success Criteria

✅ Git LFS installed and working
✅ All snapshots migrated to LFS
✅ Repository size reduced by ~50%
✅ Snapshots regenerated in Docker
✅ All snapshots using `-linux` naming
✅ GitHub Actions workflow running
✅ Test PR passes visual regression tests
✅ Bot comments on PRs with instructions
✅ Team can download and review reports
✅ LFS usage monitored in GitHub billing

## Next Steps

After successful setup:

1. ✅ Document process for team (share docs/visual-regression-quickstart.md)
2. ✅ Train team on reviewing visual diffs
3. ✅ Establish process for approving snapshot updates
4. ✅ Monitor LFS usage monthly
5. ✅ Consider expanding to all browsers if Chromium works well

## Support

- **Git LFS Issues**: https://github.com/git-lfs/git-lfs/issues
- **Playwright Issues**: https://github.com/microsoft/playwright/issues
- **GitHub Actions**: https://docs.github.com/en/actions
