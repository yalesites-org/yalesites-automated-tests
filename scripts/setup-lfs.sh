#!/bin/bash
# Script to set up Git LFS and migrate existing snapshots

set -e

echo "🔧 Setting up Git LFS for visual regression snapshots..."

# Check if git-lfs is installed
if ! command -v git-lfs &> /dev/null; then
  echo "❌ Error: git-lfs is not installed"
  echo ""
  echo "Please install Git LFS first:"
  echo "  macOS: brew install git-lfs"
  echo "  Ubuntu/Debian: sudo apt-get install git-lfs"
  echo "  Windows: Download from https://git-lfs.github.com/"
  echo ""
  exit 1
fi

# Initialize Git LFS in the repository
echo "📦 Initializing Git LFS..."
git lfs install

# Check if .gitattributes exists
if [ ! -f .gitattributes ]; then
  echo "❌ Error: .gitattributes file not found"
  echo "Please ensure .gitattributes is created with LFS tracking rules"
  exit 1
fi

echo "✅ Git LFS initialized successfully"
echo ""
echo "📊 Current snapshot status:"
du -sh snapshots/

echo ""
echo "🔄 Migrating existing snapshots to Git LFS..."
echo "⚠️  This will rewrite git history. Make sure you have committed all changes first!"
echo ""
read -p "Continue with migration? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Migration cancelled"
  exit 1
fi

# Migrate existing snapshots to LFS
echo "🚀 Starting migration (this may take a few minutes)..."
git lfs migrate import --include="snapshots/**/*.png" --everything

echo ""
echo "✅ Migration complete!"
echo ""
echo "📊 Repository size comparison:"
git count-objects -vH

echo ""
echo "🎯 Next steps:"
echo "1. Run: git lfs ls-files (to verify LFS tracking)"
echo "2. Force push to update remote: git push --force-with-lease"
echo "3. Team members will need to run: git lfs install && git lfs pull"
echo ""
echo "💡 To monitor LFS usage: https://github.com/settings/billing"
