#!/bin/bash
# Script to regenerate all visual regression snapshots in Docker
# This ensures snapshots match the Linux CI environment

set -e

# Default YALESITES_URL if not provided
YALESITES_URL=${YALESITES_URL:-"http://yalesites-platform.lndo.site"}

echo "🐳 Regenerating visual regression snapshots in Docker..."
echo "📍 Test URL: $YALESITES_URL"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running"
  echo "Please start Docker and try again"
  exit 1
fi

echo "⚠️  This will replace all existing snapshots with Linux-compatible versions"
echo "⚠️  Current snapshots directory will be backed up to snapshots-backup/"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 1
fi

# Backup existing snapshots
if [ -d snapshots ]; then
  echo "💾 Backing up existing snapshots..."
  rm -rf snapshots-backup
  cp -r snapshots snapshots-backup
  echo "✅ Backup created at snapshots-backup/"
fi

# Remove old snapshots
echo "🗑️  Removing old snapshots..."
rm -rf snapshots

# Run snapshot update in Docker
echo "🚀 Running snapshot generation in Docker..."
echo "   This may take 30-60 minutes depending on your connection to the test site"
echo ""

docker run --rm -it \
  -v "$(pwd)":/work \
  -w /work \
  -e YALESITES_URL="$YALESITES_URL" \
  -e CI=true \
  mcr.microsoft.com/playwright:v1.41.2-jammy \
  npm run update-snapshots

echo ""
echo "✅ Snapshot regeneration complete!"
echo ""
echo "📊 New snapshot stats:"
du -sh snapshots/
echo "File count: $(find snapshots -type f -name '*.png' | wc -l) PNG files"

echo ""
echo "🔍 Verifying snapshot platform..."
SAMPLE_SNAPSHOT=$(find snapshots -type f -name '*-linux.png' | head -1)
if [ -n "$SAMPLE_SNAPSHOT" ]; then
  echo "✅ Snapshots are using Linux naming convention"
else
  echo "⚠️  Warning: Snapshots may not be using expected naming convention"
  echo "   Check snapshots/ directory manually"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Review a few snapshots to ensure they look correct"
echo "2. Run tests locally to verify: npm run test"
echo "3. If satisfied, commit: git add snapshots/ && git commit -m 'chore(snapshots): regenerate for Linux CI compatibility'"
echo "4. If issues occur, restore backup: rm -rf snapshots && mv snapshots-backup snapshots"
