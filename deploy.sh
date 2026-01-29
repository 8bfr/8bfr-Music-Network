#!/data/data/com.termux/files/usr/bin/bash
set -e

# 8BFR deploy helper
# - Commits your current changes
# - Pushes to origin/main (live)
# - Moves memory/main to the PREVIOUS commit (one version behind)

# Remember current commit (this will become the "backup" in memory)
PREV_SHA=$(git rev-parse HEAD)

# If nothing changed, just push main and exit
if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️  No local changes to commit. Pushing main only."
  git push origin main
  exit 0
fi

# Commit message from first argument or default
MSG="\${1:-Auto deploy}"

echo "🔧 Staging and committing changes..."
git add -A
git commit -m "\$MSG"

echo "🚀 Pushing latest to origin/main..."
git push origin main

echo "🧠 Updating memory/main to previous commit: \$PREV_SHA"
git push --force memory "\$PREV_SHA":main

echo "✅ Done."
echo "   origin/main  = NEW version"
echo "   memory/main  = PREVIOUS version (backup)"
