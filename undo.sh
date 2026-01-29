#!/data/data/com.termux/files/usr/bin/bash
set -e

# 8BFR undo helper
# - Saves current HEAD so we can redo later
# - Resets local main to memory/main
# - Force-pushes that to origin/main (live)

# Save current HEAD so redo.sh can restore it later
CURRENT_SHA=$(git rev-parse HEAD)
echo "\$CURRENT_SHA" > .redo-pointer

echo "📥 Fetching memory remote..."
git fetch memory

echo "⏪ Resetting local main to memory/main..."
git checkout main
git reset --hard memory/main

echo "🚨 Force-pushing revert to origin/main..."
git push origin main --force

echo "✅ Undo complete."
echo "   origin/main is now set to memory/main."
echo "   Previous HEAD saved in .redo-pointer"
