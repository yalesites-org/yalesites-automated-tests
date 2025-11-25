# How to Revert Git LFS

If you need to remove Git LFS and go back to storing snapshots directly in git, follow these steps:

## Why You Might Need to Revert

- Hit GitHub LFS bandwidth limits and don't want to pay
- Team prefers simpler git workflow without LFS
- LFS causing issues with your workflow

## Steps to Revert

### 1. Untrack Files from LFS

```bash
# Remove LFS tracking from .gitattributes
git lfs untrack "snapshots/**/*.png"
git lfs untrack "test-results/**/*.png"
git lfs untrack "playwright-report/**/*.png"

# Or manually edit .gitattributes and remove the LFS lines
```

### 2. Convert LFS Files Back to Regular Git

```bash
# Export files from LFS back to regular git
git lfs migrate export --include="snapshots/**/*.png" --everything

# This rewrites history to remove LFS pointers and restore actual files
```

### 3. Remove .gitattributes LFS Configuration

Edit `.gitattributes` and remove these lines:

```
snapshots/**/*.png filter=lfs diff=lfs merge=lfs -text
test-results/**/*.png filter=lfs diff=lfs merge=lfs -text
playwright-report/**/*.png filter=lfs diff=lfs merge=lfs -text
```

Keep the line ending configurations.

### 4. Force Push to Remote

⚠️ **Warning**: This rewrites git history. Coordinate with your team first!

```bash
# Force push to update remote repository
git push --force-with-lease origin main

# If you have other branches with snapshots, update them too
git push --force-with-lease origin --all
```

### 5. Team Members Update Their Clones

After reverting, all team members need to:

```bash
# Fetch the updated history
git fetch origin

# Hard reset to the new history (⚠️ this discards local changes!)
git reset --hard origin/main

# Uninstall LFS hooks (optional)
git lfs uninstall
```

## Alternative: Disable LFS Without History Rewrite

If you want to keep LFS for historical commits but stop using it going forward:

```bash
# Remove LFS tracking from .gitattributes
# Edit .gitattributes and remove LFS filter lines

# Commit the change
git add .gitattributes
git commit -m "chore: stop using Git LFS for new snapshots"

# Future snapshot commits will use regular git
# Old snapshots remain in LFS (this is fine)
```

## Verification

After reverting, verify that files are no longer in LFS:

```bash
# Should return empty (no LFS files)
git lfs ls-files

# Check file is regular git (not a pointer)
cat snapshots/some-test/snapshot.png
# Should show binary PNG data, not "version https://git-lfs.github.com"
```

## Repository Size Impact

After reverting to regular git:
- Fresh clones will download full snapshot size (~178 MB)
- Repository size will return to ~404 MB
- No LFS bandwidth limits to worry about

## Need Help?

- Check Git LFS docs: https://git-lfs.github.com/
- GitHub support: https://support.github.com/
