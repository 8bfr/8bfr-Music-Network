#!/data/data/com.termux/files/usr/bin/bash
set -e

# 8BFR redo helper
# - Reads saved commit from .redo-pointer
# - Resets local main to that commit
# - Force-pushes it back to origin/main

if [ ! -f .redo-pointer ]; then
  echo "❌ No .redo-pointer found. Run undo.sh first."
  exit 1
fi

REDO_SHA=$(cat .redo-pointer)

echo "🔁 Restoring main to \$REDO_SHA..."
git checkout main
git reset --hard "\$REDO_SHA"

echo "🚨 Force-pushing redo to origin/main..."
git push origin main --force

echo "✅ Redo complete."
echo "   origin/main is now set back to \$REDO_SHA"
