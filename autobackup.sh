#!/bin/bash
# 8BFR Network Auto Backup
MEMORY_FILE="$HOME/8bfr_network/8bfr_network_master_memory.md"
EMAIL="8bfr.music@gmail.com"

if [ -f "$MEMORY_FILE" ]; then
    echo "📦 Sending backup..."
    mail -s "8BFR Network Backup $(date)" "$EMAIL" < "$MEMORY_FILE"
    echo "✅ Backup sent successfully."
else
    echo "❌ Memory file not found: $MEMORY_FILE"
fi
