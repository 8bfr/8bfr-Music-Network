/**
 * 8BFR Badge System - Centralized Configuration
 * Include this file in ALL pages that need badge functionality
 * Usage: <script src="badges.js"></script>
 */

// ===== BADGE CATALOG =====
const BADGE_CATALOG = [
  /* ================= MUSIC CREATORS ================= */
  { slug: "artist", label: "Artist", emoji: "🎤", group: "music_creator", requires_verify: true },
  { slug: "beatmaker", label: "Beatmaker", emoji: "🎚️", group: "music_creator", requires_verify: true },
  { slug: "producer", label: "Producer", emoji: "🎧", group: "music_creator", requires_verify: false },
  { slug: "singer", label: "Singer", emoji: "🎙️", group: "music_creator", requires_verify: false },
  { slug: "musician", label: "Musician", emoji: "🎸", group: "music_creator", requires_verify: false },
  { slug: "engineer", label: "Engineer", emoji: "🎛️", group: "music_creator", requires_verify: false },
  { slug: "songwriter", label: "Songwriter", emoji: "🎼", group: "music_creator", requires_verify: false },
  { slug: "dj", label: "DJ", emoji: "📀", group: "music_creator", requires_verify: false },
  { slug: "label", label: "Label", emoji: "🏷️", group: "music_creator", requires_verify: false },
  { slug: "promoter", label: "Promoter", emoji: "🚀", group: "music_creator", requires_verify: false },
  { slug: "videographer", label: "Videographer", emoji: "🎬", group: "music_creator", requires_verify: false },
  { slug: "photographer", label: "Photographer", emoji: "📷", group: "music_creator", requires_verify: false },
  { slug: "filmmaker", label: "Filmmaker", emoji: "🎥", group: "music_creator", requires_verify: false },
  { slug: "podcaster", label: "Podcaster", emoji: "🎙️", group: "music_creator", requires_verify: false },
  { slug: "distributor", label: "Distributor", emoji: "📡", group: "music_creator", requires_verify: false },
  { slug: "rapper", label: "Rapper", emoji: "🎤", group: "music_creator", requires_verify: false },
  { slug: "designer", label: "Designer", emoji: "🎨", group: "music_creator", requires_verify: false },

  /* ================= CREATORS / AUTHORS ================= */
  { slug: "author", label: "Author", emoji: "📖", group: "creator_author", requires_verify: false },
  { slug: "blogger", label: "Blogger", emoji: "📰", group: "creator_author", requires_verify: false },
  { slug: "game_creator", label: "Game Creator", emoji: "🎮", group: "creator_author", requires_verify: false },
  { slug: "developer", label: "Developer", emoji: "🧠", group: "creator_author", requires_verify: false },
  { slug: "streamer", label: "Streamer", emoji: "📡", group: "creator_author", requires_verify: false },
  { slug: "gamer", label: "Gamer", emoji: "🎮", group: "creator_author", requires_verify: false },

  /* ================= COMMUNITY ================= */
  { slug: "influencer", label: "Influencer", emoji: "💫", group: "community", requires_verify: false },
  { slug: "brand_ambassador", label: "Brand Ambassador", emoji: "🎯", group: "community", requires_verify: false },
  { slug: "community_leader", label: "Community Leader", emoji: "👥", group: "community", requires_verify: false },
  { slug: "fan", label: "Fan", emoji: "💎", group: "community", requires_verify: false },
  { slug: "parent", label: "Parent", emoji: "🧩", group: "community", requires_verify: false },
  { slug: "student", label: "Student", emoji: "🎓", group: "community", requires_verify: false },
  { slug: "educator", label: "Educator", emoji: "🏫", group: "community", requires_verify: false },
  { slug: "supporter", label: "Supporter", emoji: "🤝", group: "community", requires_verify: false },
  { slug: "collector", label: "Collector", emoji: "🪙", group: "community", requires_verify: false },
  { slug: "mentor", label: "Mentor", emoji: "🧭", group: "community", requires_verify: false },
  { slug: "kids", label: "Kids", emoji: "👶", group: "community", requires_verify: false },

  /* ================= 8BFR SPECIAL ================= */
  { slug: "8bfrfan", label: "8BFR Fan", emoji: "🟣", group: "8bfr_special", requires_verify: false },
  { slug: "fyp", label: "FYP", emoji: "🟦", group: "8bfr_special", requires_verify: false },

  /* ================= STAFF ROLES ================= */
  { slug: "g7", label: "G7", emoji: "👑", group: "staff_roles", requires_verify: false },
  { slug: "mod", label: "Moderator", emoji: "💬", group: "staff_roles", requires_verify: false },
  { slug: "admin", label: "Admin", emoji: "⚙️", group: "staff_roles", requires_verify: false },
  { slug: "owner", label: "Owner", emoji: "👑", group: "staff_roles", requires_verify: false },
  { slug: "verified", label: "Verified", emoji: "🛡️", group: "staff_roles", requires_verify: false },

  /* ================= ECONOMY & REWARDS ================= */
  { slug: "donor", label: "Donor", emoji: "💰", group: "economy_rewards", requires_verify: false },
  { slug: "sponsor", label: "Sponsor", emoji: "💵", group: "economy_rewards", requires_verify: false },
  { slug: "contest_winner", label: "Contest Winner", emoji: "🏆", group: "economy_rewards", requires_verify: false },
  { slug: "tournament_champion", label: "Tournament Champion", emoji: "🎮", group: "economy_rewards", requires_verify: false },
  { slug: "event_participant", label: "Event Participant", emoji: "🎁", group: "economy_rewards", requires_verify: false },
  { slug: "early_supporter", label: "Early Supporter", emoji: "🎫", group: "economy_rewards", requires_verify: false },
  { slug: "top_creator", label: "Top Creator", emoji: "🏅", group: "economy_rewards", requires_verify: false },
  { slug: "trending", label: "Trending", emoji: "🔥", group: "economy_rewards", requires_verify: false },
  { slug: "vip_member", label: "VIP Member", emoji: "🎖️", group: "economy_rewards", requires_verify: false },
  { slug: "beta_tester", label: "Beta Tester", emoji: "🧪", group: "economy_rewards", requires_verify: false },
  { slug: "founder", label: "Founder", emoji: "⚡", group: "economy_rewards", requires_verify: false },

  /* ================= AI CARRIE ================= */
  { slug: "carrie_ai_assistant", label: "Carrie AI Assistant", emoji: "🤖", group: "ai_carrie", requires_verify: false },
  { slug: "carrie_performer", label: "Carrie Performer", emoji: "🎭", group: "ai_carrie", requires_verify: false },
  { slug: "carrie_concert_vip", label: "Carrie Concert VIP", emoji: "💃", group: "ai_carrie", requires_verify: false },
  { slug: "carrie_fashionista", label: "Carrie Fashionista", emoji: "🪞", group: "ai_carrie", requires_verify: false },
  { slug: "carrie_voice_clone", label: "Carrie Voice Clone", emoji: "🎙️", group: "ai_carrie", requires_verify: false }
];

// ===== HELPER FUNCTIONS =====

/**
 * Get full badge object by slug
 * @param {string} slug - Badge slug (e.g. 'artist', 'producer')
 * @returns {object|undefined} Badge object or undefined if not found
 */
function getBadgeBySlug(slug) {
  return BADGE_CATALOG.find(b => b.slug === slug);
}

/**
 * Get badge emoji from badges array
 * @param {array} badges - Array of badge slugs
 * @returns {string} Emoji for first badge or default user emoji
 */
function getBadgeEmoji(badges) {
  if (!badges || !badges.length) return '👤';
  const badge = getBadgeBySlug(badges[0]);
  return badge ? badge.emoji : '👤';
}

/**
 * Get badge label from slug
 * @param {string} badgeSlug - Badge slug
 * @returns {string} Human-readable label or 'User'
 */
function getBadgeLabel(badgeSlug) {
  const badge = getBadgeBySlug(badgeSlug);
  return badge ? badge.label : 'User';
}

/**
 * Get badge group from slug
 * @param {string} badgeSlug - Badge slug
 * @returns {string} Badge group or 'community'
 */
function getBadgeGroup(badgeSlug) {
  const badge = getBadgeBySlug(badgeSlug);
  return badge ? badge.group : 'community';
}

/**
 * Check if user is a music creator (music_creator group)
 * @param {array} badges - Array of badge slugs
 * @returns {boolean} True if first badge is in music_creator group
 */
function isMusicCreator(badges) {
  if (!badges || !badges.length) return false;
  const badge = getBadgeBySlug(badges[0]);
  return badge && badge.group === 'music_creator';
}

/**
 * Check if badge requires verification
 * @param {string} badgeSlug - Badge slug
 * @returns {boolean} True if badge requires verification
 */
function requiresVerification(badgeSlug) {
  const badge = getBadgeBySlug(badgeSlug);
  return badge ? badge.requires_verify : false;
}

/**
 * Get all badges in a specific group
 * @param {string} group - Group name (e.g. 'music_creator')
 * @returns {array} Array of badge objects in that group
 */
function getBadgesByGroup(group) {
  return BADGE_CATALOG.filter(b => b.group === group);
}

/**
 * Get all unique badge groups
 * @returns {array} Array of group names
 */
function getAllBadgeGroups() {
  return [...new Set(BADGE_CATALOG.map(b => b.group))];
}

/**
 * Validate badge selection (checks if badges exist and are valid)
 * @param {array} badges - Array of badge slugs to validate
 * @returns {object} { valid: boolean, invalidBadges: array }
 */
function validateBadges(badges) {
  const invalidBadges = [];
  
  badges.forEach(slug => {
    if (!getBadgeBySlug(slug)) {
      invalidBadges.push(slug);
    }
  });
  
  return {
    valid: invalidBadges.length === 0,
    invalidBadges: invalidBadges
  };
}

/**
 * Render badge as HTML chip
 * @param {string} badgeSlug - Badge slug
 * @param {boolean} showEmoji - Whether to show emoji (default true)
 * @returns {string} HTML string for badge chip
 */
function renderBadgeChip(badgeSlug, showEmoji = true) {
  const badge = getBadgeBySlug(badgeSlug);
  if (!badge) return '';
  
  return `
    <span class="badge-chip" data-badge="${badge.slug}" data-group="${badge.group}">
      ${showEmoji ? badge.emoji + ' ' : ''}${badge.label}
    </span>
  `;
}

/**
 * Render multiple badges as HTML chips
 * @param {array} badges - Array of badge slugs
 * @param {boolean} showEmoji - Whether to show emojis (default true)
 * @returns {string} HTML string for all badge chips
 */
function renderBadgeChips(badges, showEmoji = true) {
  if (!badges || !badges.length) return '';
  return badges.map(slug => renderBadgeChip(slug, showEmoji)).join(' ');
}

// ===== EXPORT FOR MODULE USE (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BADGE_CATALOG,
    getBadgeBySlug,
    getBadgeEmoji,
    getBadgeLabel,
    getBadgeGroup,
    isMusicCreator,
    requiresVerification,
    getBadgesByGroup,
    getAllBadgeGroups,
    validateBadges,
    renderBadgeChip,
    renderBadgeChips
  };
}
