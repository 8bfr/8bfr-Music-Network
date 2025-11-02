#!/data/data/com.termux/files/usr/bin/bash
# 🔁 8BFR Network Auto-Backup Script

cd ~/8bfr

echo "📦 Pulling latest changes..."
git pull origin main

echo "💾 Adding all updated files..."
git add .

echo "🧾 Committing with timestamp..."
git commit -m "Auto-backup $(date '+%Y-%m-%d %H:%M:%S')"

echo "☁️ Pushing to GitHub..."
git push origin main

# Optional: send email copy (requires termux-api + mailutils)
# mail -s "8BFR Backup $(date)" youremail@example.com < 8BFR_MASTER_MEMORY.md

echo "✅ Backup complete!"

