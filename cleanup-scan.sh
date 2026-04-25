#!/data/data/com.termux/files/usr/bin/bash
# ═══════════════════════════════════════════════════════════════════
# 8BFR REPO CLEANUP — SAFE FILE DELETION SCRIPT
# Run from inside your repo: cd ~/8bfr_network && bash cleanup-scan.sh
#
# WHAT IT DOES:
#  1. Scans every .html/.js/.css file for references (href=/src=/import/url())
#  2. Categorizes candidate dead files into:
#       - SAFE (zero references found anywhere)
#       - REFERENCED (something links to it - DON'T delete)
#       - PROTECTED (always keep - 404, auth-callback, etc.)
#  3. Generates cleanup-report.txt with the verdict for each
#  4. Generates safe-delete.sh — a script you can review and run
#
# IMPORTANT: This script does NOT delete anything. It only generates a report.
# You review the report, then optionally run safe-delete.sh.
# ═══════════════════════════════════════════════════════════════════

set -e
REPO_DIR="$(pwd)"
REPORT="cleanup-report.txt"
DELETE_SCRIPT="safe-delete.sh"

# ── Colors for terminal output ──
if [ -t 1 ]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
  BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BLUE=''; CYAN=''; NC=''
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  8BFR REPO CLEANUP — Reference Scanner${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Repo: $REPO_DIR"
echo "Generating: $REPORT"
echo ""

# ── CANDIDATE LISTS ──
# These are files that LOOK like duplicates/dead code, but we'll verify before deleting.

# TIER 1: Test/debug files - very safe pattern
CANDIDATES_TEST=(
  "signup-test.html"
  "paypal-test.html"
  "test-data-loading.html"
  "test-filter.html"
  "zz-test.html"
  "debug.html"
  "debug-closet.html"
  "user-debug.html"
  "buy-ad-debug.html"
  "owner-panel-mobile-debug.html"
  "access-checker.html"
  "access-diagnostics.html"
)

# TIER 2: "FIXED"/"cleaned"/"-2" backup-style files
CANDIDATES_BACKUP=(
  "carrie-chat-FIXED.html"
  "carrie-chat-cleaned.html"
  "carrie-chat-2.html"
  "carrie-closet-stand-alone.html"
  "scripts-v2.js"
  "shim_client.html"
  "shim_client.js"
  "_template-page.html"
  "floating-avitar.html"
  "profile-1.html"
)

# TIER 3: Underscore-vs-hyphen duplicates (you said all switched to hyphens)
CANDIDATES_UNDERSCORE=(
  "admin_panel.html"
  "mod_panel.html"
  "creator_tools.html"
  "reset_password.html"
  "studio_tools.html"
  "cover_ai.html"
)

# TIER 4: Old AI pages (already redirected by scripts.js)
CANDIDATES_OLDAI=(
  "ai-tools.html"
  "ai-tools__1_.html"
  "ai-chat.html"
  "ai-music-expert.html"
  "ai-music-network.html"
  "rhyme-ai.html"
  "author-hub.html"
  "translate.html"
  "studio.html"
  "studio-tools.html"
  "lyric-ai.html"
  "lyrics-ai.html"
  "song-ai.html"
  "voice-ai.html"
  "mastering.html"
  "converter.html"
)

# TIER 5: Game files (you said keep IF the system works, delete if not)
CANDIDATES_GAMES=(
  "pool-8-ball.html"
  "pool-9-ball.html"
  "trickshot-pool.html"
  "game_pool_8ball.html"
  "game_pool_9ball.html"
  "game_pool_trick.html"
  "game-music.html"
)

# TIER 6: Possibly-redundant admin/owner pages (check carefully!)
CANDIDATES_ADMIN=(
  "admin.html"
  "admin-hub.html"
  "admin-panel-live.html"
  "admin-posts.html"
  "admin-reports.html"
  "admin-users.html"
  "admin-ads.html"
  "admin-guide.html"
  "owner.html"
  "owner-monitor.html"
  "owner-logs.html"
  "owner-payouts.html"
  "owner-picks.html"
  "owner-sales.html"
  "owner-settings.html"
  "owner-users.html"
  "owner-ads.html"
  "owner-kidzone.html"
  "owner-verifications.html"
  "owner-coin-gift.html"
  "owner-song-discounts.html"
  "owner-coupons.html"
  "owner-pages.js"
  "owner-users.js"
  "owner-editor.js"
  "owner-discounts.js"
  "owner-approvals.js"
  "owner-auth.js"
  "owner-ads.js"
  "owner-danger-zone.js"
  "owner-panel-mobile.html"
)

# TIER 7: Other suspicious singles
CANDIDATES_OTHER=(
  "home.html"
  "register.html"
  "logout.html"
  "_template-page.html"
  "page-template-clean.html"
  "carrie-chat.html"
  "carrie-chat.js"
  "carrie-chat-data.js"
  "carrie-closet.html"
  "carrie-closet.js"
  "carrie-closet-data.js"
  "carrie-concerts.html"
  "carrie-memory.js"
  "carrie-supabase-sync.js"
  "carrie-avatar-positioning.css"
  "closet-items.css"
  "menu.html"
  "footer.html"
  "thank_you.html"
)

# ── PROTECTED LIST (never suggest deleting these) ──
PROTECTED=(
  "404.html" "index.html" "landing.html" "themes.html"
  "auth-callback.html" "login.html" "signup.html"
  "scripts.js" "design-system.css" "style.css"
  "ai-studio.html" "owner-studio.html" "owner-panel.html" "owner-discounts.html"
  "beatmaker.html" "stem-splitter.html" "music-video.html" "master-ai.html"
  "link-tools.html" "feed.html" "profile.html" "radio.html"
  "checkout.html" "pricing.html" "shop.html"
  "kids-zone.html" "kidzone-studio.html"
)

# Helper: is this filename in the protected list?
is_protected() {
  local file="$1"
  for p in "${PROTECTED[@]}"; do
    if [ "$p" = "$file" ]; then return 0; fi
  done
  return 1
}

# Helper: count references to a file across the repo
# Looks for "filename" in href=, src=, import, url() across html/js/css
count_refs() {
  local target="$1"
  # Escape special regex chars in filename
  local pattern=$(echo "$target" | sed 's/\./\\./g')
  # Search but exclude the file itself and our own report files
  local count=$(grep -rEl --include='*.html' --include='*.js' --include='*.css' --include='*.json' \
    "${pattern}" "$REPO_DIR" 2>/dev/null \
    | grep -v "^${REPO_DIR}/${target}$" \
    | grep -v "cleanup-report.txt" \
    | grep -v "safe-delete.sh" \
    | grep -v "cleanup-scan.sh" \
    | wc -l)
  echo $count
}

# Helper: check if a file actually exists in the repo
file_exists() {
  [ -f "$1" ]
}

# ── Initialize the report ──
{
  echo "═══════════════════════════════════════════════════════════════"
  echo "  8BFR REPO CLEANUP REPORT"
  echo "  Generated: $(date)"
  echo "  Repo: $REPO_DIR"
  echo "═══════════════════════════════════════════════════════════════"
  echo ""
  echo "Legend:"
  echo "  ✅ SAFE       — No references found, safe to delete"
  echo "  ⚠️  REFERENCED — At least one file links to this, don't delete blindly"
  echo "  ❌ NOT FOUND  — File doesn't exist (already deleted)"
  echo "  🛡️  PROTECTED  — Critical file, keep no matter what"
  echo ""
} > "$REPORT"

# ── Initialize the delete script ──
{
  echo "#!/data/data/com.termux/files/usr/bin/bash"
  echo "# ═══════════════════════════════════════════════════════════════════"
  echo "# AUTO-GENERATED SAFE DELETE SCRIPT — review before running"
  echo "# Generated: $(date)"
  echo "# ═══════════════════════════════════════════════════════════════════"
  echo ""
  echo "set -e"
  echo "echo '───────────────────────────────────────────────────────────'"
  echo "echo 'About to delete files marked SAFE in cleanup-report.txt.'"
  echo "echo 'These have ZERO references in any HTML/JS/CSS file in the repo.'"
  echo "echo '───────────────────────────────────────────────────────────'"
  echo "read -p 'Type YES to proceed: ' confirm"
  echo "if [ \"\$confirm\" != \"YES\" ]; then echo 'Cancelled.'; exit 1; fi"
  echo ""
} > "$DELETE_SCRIPT"

# ── Process a tier of candidates ──
process_tier() {
  local tier_name="$1"
  shift
  local files=("$@")

  echo "" >> "$REPORT"
  echo "═══ ${tier_name} ═══" >> "$REPORT"
  echo "" >> "$REPORT"
  echo -e "${BLUE}Scanning: ${tier_name}${NC}"

  local safe_count=0
  local ref_count=0
  local missing_count=0
  local protected_count=0

  for f in "${files[@]}"; do
    if is_protected "$f"; then
      printf "  🛡️  PROTECTED  %s\n" "$f" >> "$REPORT"
      ((protected_count++)) || true
      continue
    fi

    if ! file_exists "$f"; then
      printf "  ❌ NOT FOUND  %s\n" "$f" >> "$REPORT"
      ((missing_count++)) || true
      continue
    fi

    local refs=$(count_refs "$f")
    if [ "$refs" -eq 0 ]; then
      printf "  ✅ SAFE        %s   (0 references)\n" "$f" >> "$REPORT"
      echo "rm -v \"$f\"" >> "$DELETE_SCRIPT"
      ((safe_count++)) || true
    else
      printf "  ⚠️  REFERENCED  %s   (%d references)\n" "$f" "$refs" >> "$REPORT"
      # Show the referencing files in the report
      echo "      ↳ Referenced in:" >> "$REPORT"
      grep -rEl --include='*.html' --include='*.js' --include='*.css' --include='*.json' \
        "$(echo "$f" | sed 's/\./\\./g')" "$REPO_DIR" 2>/dev/null \
        | grep -v "^${REPO_DIR}/${f}$" \
        | grep -v "cleanup-report.txt" \
        | grep -v "safe-delete.sh" \
        | grep -v "cleanup-scan.sh" \
        | head -5 \
        | while read referer; do
            echo "         - $(basename "$referer")" >> "$REPORT"
          done
      ((ref_count++)) || true
    fi
  done

  echo "" >> "$REPORT"
  printf "  Summary: %d safe to delete, %d referenced, %d not found, %d protected\n" \
    "$safe_count" "$ref_count" "$missing_count" "$protected_count" >> "$REPORT"

  echo -e "    ${GREEN}${safe_count} safe${NC} · ${YELLOW}${ref_count} referenced${NC} · ${missing_count} missing · ${protected_count} protected"
}

# ── Run all tiers ──
process_tier "TIER 1: Test/Debug pages"           "${CANDIDATES_TEST[@]}"
process_tier "TIER 2: Backup-style files"          "${CANDIDATES_BACKUP[@]}"
process_tier "TIER 3: Underscore duplicates"       "${CANDIDATES_UNDERSCORE[@]}"
process_tier "TIER 4: Old AI pages"                "${CANDIDATES_OLDAI[@]}"
process_tier "TIER 5: Game files"                  "${CANDIDATES_GAMES[@]}"
process_tier "TIER 6: Admin/Owner pages"           "${CANDIDATES_ADMIN[@]}"
process_tier "TIER 7: Other suspicious"            "${CANDIDATES_OTHER[@]}"

# ── Tmp_backup folder ──
echo "" >> "$REPORT"
echo "═══ FOLDER: tmp_backup ═══" >> "$REPORT"
echo "" >> "$REPORT"
if [ -d "tmp_backup" ]; then
  count=$(find tmp_backup -type f 2>/dev/null | wc -l)
  echo "  📁 tmp_backup/ exists with $count files" >> "$REPORT"
  echo "  This is a backup folder — likely safe to delete entirely." >> "$REPORT"
  echo "  Verify it has no important files first, then run: rm -rf tmp_backup" >> "$REPORT"
else
  echo "  ❌ tmp_backup/ — already deleted or doesn't exist" >> "$REPORT"
fi

# ── Final summary ──
chmod +x "$DELETE_SCRIPT" 2>/dev/null || true

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✓ DONE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Two files generated:"
echo "  📄 ${REPORT}    — Review this for the full analysis"
echo "  🗑️  ${DELETE_SCRIPT}  — Run this to delete the SAFE files"
echo ""
echo "NEXT STEPS:"
echo "  1. View the report:    cat ${REPORT} | less"
echo "  2. Or just summary:    grep -E '(✅|⚠️ )' ${REPORT}"
echo "  3. Review the delete script: cat ${DELETE_SCRIPT}"
echo "  4. Run if it looks good: bash ${DELETE_SCRIPT}"
echo ""
echo "REMEMBER: Files marked ⚠️ REFERENCED are linked from somewhere."
echo "Don't delete those without checking the referrer file first."
echo ""
