#!/data/data/com.termux/files/usr/bin/bash
# 🎵 8BFR Mini Backup Script (safe test)

# === CONFIG ===
SRC="$HOME/8bfr"
DEST="/storage/emulated/0/8bfr_backups"
DATE=$(date +%F_%H-%M-%S)
FILE="$DEST/backup_$DATE.tar.gz"

# === START ===
echo "🎧 Starting mini backup..."
mkdir -p "$DEST"

if [ ! -d "$SRC" ]; then
  echo "❌ Source folder $SRC not found!"
  exit 1
fi

tar -czf "$FILE" "$SRC" --exclude="$DEST" --exclude=".git" 2>/dev/null

if [ -f "$FILE" ]; then
  echo "✅ Backup created: $FILE"
else
  echo "⚠️ Backup failed to create."
fi

