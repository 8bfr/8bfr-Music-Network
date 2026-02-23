// 8bfr-knowledge.js — Platform Knowledge Base for AI Chats
// Load this script on ai-chat.html and ai-music-expert.html
// Usage: window.PLATFORM_KNOWLEDGE contains everything the AI needs to know

window.PLATFORM_KNOWLEDGE = `

=== 8BFR MUSIC NETWORK — COMPLETE PLATFORM GUIDE ===

8BFR Music Network is a social music platform connecting artists, beatmakers, fans, and music industry professionals. It's built with Supabase (database + auth), hosted on GitHub Pages, with AI tools powered by Groq/Pollinations.

Website: https://8bfr.github.io/8bfr-Music-Network/
Owner: 8bfr_Official (Jim)

============================
SECTION 1: USER ACCOUNTS
============================

HOW TO SIGN UP:
1. Go to signup.html or click "Sign Up" from the homepage
2. Enter your email and create a password
3. Check your email for a verification link from Supabase
4. Click the verification link — you'll be redirected to verify-email.html
5. Once verified, you can log in and create your profile

HOW TO LOG IN:
1. Go to login.html or click "Log In"
2. Enter your email and password
3. You'll be redirected to your profile page after login
4. Sessions persist — you stay logged in until you log out

HOW TO CREATE A PROFILE:
1. After first login, you'll be prompted to set up your profile
2. Choose your username (unique, cannot be changed easily)
3. Set your display name (can be changed anytime)
4. Choose your role: artist, beatmaker, producer, singer, rapper, musician, songwriter, DJ, fan, or other
5. Add an optional avatar/profile photo
6. Add optional bio, social links, location

USER ROLES:
- Artist: musicians who release original music
- Beatmaker: producers who sell beats and instrumentals
- Producer: music producers and engineers
- Singer: vocalists
- Rapper: hip-hop/rap artists
- Musician: general musicians
- Songwriter: writers who create lyrics/compositions
- DJ: disc jockeys and mixers
- Fan: music listeners and supporters
- Owner: platform administrator (8bfr_Official only)

ACCOUNT SETTINGS (settings.html):
- Update display name, bio, avatar
- Configure PayPal email for receiving payments (artists/beatmakers)
- Change password
- Manage notification preferences

============================
SECTION 2: NAVIGATING THE SITE
============================

MAIN PAGES:
- Home (index.html) — Featured content, trending songs, latest posts
- Feed (feed.html) — Community feed with posts, photos, videos from all users
- Radio (radio.html) — Streaming radio player with uploaded songs
- Search (search.html) — Search profiles, songs, posts, and ads
- Charts (charts.html) — Top songs ranked by algorithm points
- Singles (singles.html) — Browse all available singles for purchase
- Featured Artists (featured-artists.html) — Highlighted artists picked by the platform
- Featured Songs (featured-songs.html) — Highlighted songs with inline audio players
- Owner Picks (owner-picks.html) — Hand-picked content by the platform owner
- Fan Zone (fan-zone.html) — Community stats, top fans, engagement leaderboard

SOCIAL PAGES:
- Profile (profile.html) — Your profile with posts, songs, stories, social stats
- Followers (followers.html) — See who follows you
- Following (following.html) — See who you follow
- Friends (friends.html) — Mutual connections

MESSAGING:
- Community Chat (chatroom.html) — Public chat room for all users
- Direct Messages (dm.html) — Private 1-on-1 messaging
- Messages Hub (messages.html) — Overview of DMs, notifications, and reports

CONTENT CREATION:
- Upload (upload.html) — Upload songs, beats, albums
- Story Upload (story-upload.html) — Create 24-hour stories with text or photos
- Feed posts — Create text, photo, or video posts from the feed page

SHOPPING:
- Cart (cart.html) — Shopping cart for song purchases
- Checkout (checkout.html) — PayPal payment processing
- Purchases (purchases.html) — Download history for purchased songs

============================
SECTION 3: HOW TO BUY/DOWNLOAD SONGS
============================

PURCHASING A SONG — Step by Step:
1. Find a song you want to buy:
   - Browse singles.html for all available songs
   - Check featured-songs.html for highlighted tracks
   - Search for specific songs on search.html
   - Listen to songs on radio.html
   - Find songs on artist profiles
2. Click the "Buy" or "Add to Cart" button on any song
3. The song is added to your cart (cart.html)
4. Go to cart.html to review your items
5. Click "Checkout" to proceed to payment
6. On checkout.html, review the total and click "Pay with PayPal"
7. Complete payment through PayPal's secure checkout
8. After payment confirms, the song is added to your purchases
9. Go to purchases.html to download your purchased songs
10. Each song has a download limit (typically 3-5 downloads)

PRICING:
- Prices are set by the artist/beatmaker who uploaded the song
- All payments go through PayPal
- The platform takes a small percentage for maintenance
- Artists receive payouts to their configured PayPal email

FOR ARTISTS — SELLING YOUR MUSIC:
1. Go to settings.html and add your PayPal email
2. Upload your song on upload.html
3. Set your price
4. Your song becomes available on singles, search, and radio
5. When someone purchases, payment is processed through PayPal
6. You'll receive your payout minus the platform fee

============================
SECTION 4: CREATING CONTENT
============================

CREATING A POST:
1. Go to feed.html
2. Click the "Create Post" button or use the post composer at the top
3. Choose post type: Text, Photo, or Video
4. Write your caption/text
5. If photo/video, upload your media file
6. Click "Post" to publish
7. Your post appears in the community feed
8. Other users can like, comment, and share your post
9. Posts earn algorithm points based on engagement

UPLOADING A SONG:
1. Go to upload.html
2. Fill in: song title, artist name, genre
3. Upload the audio file (MP3, WAV, etc.)
4. Upload optional cover art
5. Set the price (or free)
6. Add tags for better discoverability
7. Click "Upload" — your song is now live
8. It will appear on radio, singles, search, and your profile

CREATING A STORY:
1. Go to story-upload.html (or click "+ Add Story" on your profile)
2. Choose story type: Text or Photo
3. For text stories: type your message, pick a background color/gradient
4. For photo stories: upload an image, add optional text overlay
5. Click "Publish" — your story appears on your profile
6. Stories expire automatically after 24 hours
7. You earn 10 algorithm points for each story

============================
SECTION 5: SOCIAL FEATURES
============================

FOLLOWING USERS:
1. Visit any user's profile
2. Click the "Follow" button
3. Their posts will appear in your feed
4. They'll see you in their followers list
5. You can unfollow anytime from their profile or your following page

ADDING FRIENDS:
1. Visit a user's profile
2. Click the "Add Friend" button
3. This sends a friend request
4. If they accept, you become mutual friends
5. Friends appear on your friends page (friends.html)

LIKING POSTS:
1. Click the heart/like button on any post
2. Likes contribute to the post's algorithm score
3. The post creator earns algorithm points from likes

COMMENTING:
1. Click the comment icon on any post
2. Type your comment in the modal that appears
3. Comments are threaded — you can reply to other comments
4. Comments also boost the post's algorithm score

FAVORITES:
1. Click the star/favorite button on songs or posts
2. Favorited items appear in the Favorites tab on your profile
3. Favorites help the algorithm recommend content to you

============================
SECTION 6: ALGORITHM & TIER SYSTEM
============================

HOW ALGORITHM POINTS WORK:
- Every action on the platform earns or costs algorithm points
- Points determine your tier badge and visibility

EARNING POINTS:
- Creating a post: +5 points
- Uploading a song: +15 points
- Creating a story: +10 points
- Receiving a like on your post: +2 points
- Receiving a comment: +3 points
- Getting a new follower: +5 points
- Someone purchases your song: +20 points
- Daily login bonus: +1 point

TIER BADGES:
- 🥉 Bronze: 0-99 points (starting tier)
- 🥈 Silver: 100-499 points
- 🥇 Gold: 500-1,999 points
- 💎 Diamond: 2,000-9,999 points
- 👑 Platinum: 10,000+ points

Your tier badge shows on your profile next to your name. Higher tiers get more visibility in featured sections and search results.

============================
SECTION 7: COMMUNITY CHAT
============================

USING THE CHAT ROOM (chatroom.html):
1. Go to chatroom.html (must be logged in)
2. Type your message in the input box at the bottom
3. Press Enter or click the send button
4. Messages appear in real-time for all users
5. You can see other users' messages as they type
6. Messages show username, avatar, and timestamp

CHAT RULES:
- Be respectful to all users
- No spam, harassment, or hate speech
- No explicit or inappropriate content
- No advertising or self-promotion in excess
- Violations can result in kick (temporary) or ban (permanent)

REPORTING A MESSAGE:
1. Hover over any message (not your own)
2. Click the 🚩 Report button
3. Describe why you're reporting the message
4. Click "Submit Report"
5. The platform owner will review the report and take action

IF YOU GET KICKED:
- You'll see a notice saying you've been kicked
- Kicks are temporary — you can return after the timer expires
- The kick duration is set by the moderator (usually 5-30 minutes)

IF YOU GET BANNED:
- You'll see a permanent ban notice
- You cannot send messages in the chat room
- Contact the platform owner if you believe the ban is unjust

============================
SECTION 8: DIRECT MESSAGES
============================

SENDING A DM:
1. Go to dm.html
2. Click the "+" button to start a new conversation
3. Search for the user you want to message
4. Click their name to open the conversation
5. Type your message and press Enter or click send
6. Messages are delivered in real-time
7. You can also start a DM from someone's profile page

DM FEATURES:
- Real-time message delivery
- Unread message indicators (purple dot)
- Conversation search
- Message read receipts
- Report inappropriate messages with 🚩 button

REPORTING A DM:
1. Hover over any received message
2. Click the 🚩 button that appears
3. Describe the issue
4. Submit — the owner will review the reported message content

============================
SECTION 9: SEARCH & DISCOVERY
============================

USING SEARCH (search.html):
- Search across multiple categories: Profiles, Songs, Posts, Ads
- Use keywords, artist names, song titles, or genres
- Filter results by category
- Results show previews with quick-action buttons (follow, play, buy)

DISCOVERING MUSIC:
- Featured Songs: Hand-picked highlights with inline audio players
- Featured Artists: Spotlighted creators
- Owner Picks: Personal recommendations from the platform owner
- Charts: Songs ranked by algorithm score (most popular)
- Radio: Continuous streaming of uploaded songs
- Feed: See what artists you follow are posting

============================
SECTION 10: RADIO
============================

HOW RADIO WORKS (radio.html):
1. Go to radio.html
2. Songs from the platform are loaded into the player
3. Click play to start streaming
4. Use next/previous buttons to skip tracks
5. Volume control and progress bar available
6. Songs play from the Supabase song database
7. If you hear something you like, click "Buy" to purchase

============================
SECTION 11: STORIES
============================

VIEWING STORIES:
1. Visit any user's profile
2. Their active stories appear in a carousel at the top
3. Click a story to view it full-screen
4. Stories show the background color/gradient and text or photo
5. Stories auto-expire after 24 hours

CREATING STORIES:
1. From your profile, click "+ Add Story"
2. Or go directly to story-upload.html
3. Choose Text or Photo story type
4. Customize with background colors and gradients
5. Character limit: 200 characters for text
6. Photo limit: 5MB max file size
7. Click "Publish" — you earn 10 algorithm points

============================
SECTION 12: FOR ARTISTS & BEATMAKERS
============================

GETTING STARTED AS AN ARTIST:
1. Sign up and choose your role (artist, beatmaker, producer, etc.)
2. Complete your profile with bio, avatar, and social links
3. Add your PayPal email in settings for receiving payments
4. Upload your first song on upload.html
5. Set competitive pricing
6. Share your profile link to promote your music
7. Engage with the community — post, comment, follow others
8. Build your algorithm points to increase visibility

MAXIMIZING YOUR REACH:
- Post regularly to stay visible in the feed
- Create stories to appear at the top of your profile
- Engage with other artists — comment, follow, collaborate
- Use relevant tags when uploading songs
- Share your 8BFR profile on other social media
- Higher algorithm tier = more visibility in featured sections

GETTING FEATURED:
- The platform owner selects featured artists and songs
- Higher engagement and quality music increases your chances
- Consistent posting and community engagement helps
- Featured placement is free — it's based on merit

PAYOUTS:
- When someone purchases your song, payment goes through PayPal
- You receive the payment minus a small platform fee
- Make sure your PayPal email is correct in settings
- Payout history is viewable in the owner panel (for the owner)

============================
SECTION 13: AI TOOLS (OWNER STUDIO)
============================

AVAILABLE AI TOOLS:
The Owner Studio (owner-studio.html) provides AI-powered creative tools:

1. ✍️ LYRICS GENERATOR — Generates complete song lyrics
   - Specify genre, mood, theme, rhyme scheme
   - Gets verse/chorus/bridge structure
   - Great for brainstorming or overcoming writer's block

2. 📝 POST GENERATOR — Creates social media posts
   - Specify platform (Instagram, Twitter, etc.)
   - Gets ready-to-paste posts with hashtags and CTAs
   - Good for promoting new releases

3. 🎨 ALBUM COVER GENERATOR — Creates actual images
   - Describe your vision (colors, style, mood)
   - AI enhances your description and generates a real image
   - Download the image directly
   - Free via Pollinations.ai

4. 🎤 SONG CREATOR — Full song structure with lyrics
   - Gets complete lyrics for all sections
   - Includes tempo, key, flow pattern suggestions
   - Detailed delivery notes

5. 🎵 BEAT IDEAS — Production blueprints (text only)
   - Detailed beat concepts with tempo, key, instruments
   - Drum patterns and arrangement suggestions
   - Not actual audio — it's a creative brief for producers

6. 🎬 VIDEO CONCEPTS — Storyboard ideas (text only)
   - Scene-by-scene storyboard with shots and transitions
   - Setting, wardrobe, effects suggestions
   - Not actual video — it's a creative brief for directors

IMPORTANT: Copy your AI output before leaving the page — results are NOT saved.

AI CHAT ASSISTANTS:
- 🤖 General AI Chat — Ask anything: coding, business, ideas, writing
- 🎓 Music Expert AI — Learn tips, tricks, theory, production, marketing

============================
SECTION 14: PLATFORM NAVIGATION TIPS
============================

QUICK NAVIGATION:
- Home button or logo always takes you to index.html
- Hamburger menu (☰) on mobile shows all page links
- Your profile link appears in the header when logged in
- Use the search page for finding anything specific

MOBILE EXPERIENCE:
- All pages are mobile-responsive
- Swipe gestures work on carousels and stories
- Chat rooms work on mobile with adapted layouts
- DMs have a sidebar that collapses on small screens

BROWSER SUPPORT:
- Works best on Chrome, Firefox, Safari, Edge
- JavaScript must be enabled
- Cookies/localStorage must be enabled for login persistence

============================
SECTION 15: TROUBLESHOOTING
============================

COMMON ISSUES:

"I can't log in"
- Make sure you verified your email (check spam folder)
- Try resetting your password
- Clear browser cache and cookies
- Make sure you're using the correct email

"My post isn't showing"
- Refresh the feed page
- Check if the post was auto-moderated
- Make sure you clicked the Post button (not just typed)

"I can't upload a song"
- Check file size (there may be limits)
- Make sure the audio format is supported (MP3, WAV)
- You must be logged in with a creator role

"My purchase isn't showing"
- Check purchases.html for your download history
- Make sure PayPal payment completed successfully
- Try refreshing the page
- If still missing, report the issue

"The page is frozen/blank"
- Clear browser cache
- Try a different browser
- Make sure JavaScript is enabled
- Check your internet connection

"I was banned from chat"
- Contact the platform owner through DMs or another channel
- Explain your situation
- Bans are reviewed on a case-by-case basis

"Songs won't play on radio"
- Check your internet connection
- Try refreshing the page
- Make sure your browser allows audio playback
- Try clicking play instead of relying on autoplay

============================
SECTION 16: PLATFORM STATS & INFO
============================

TECHNOLOGY:
- Frontend: HTML, CSS, JavaScript (no framework — vanilla)
- Backend: Supabase (PostgreSQL database + Auth + Realtime + Storage)
- Hosting: GitHub Pages
- Payments: PayPal API
- AI: Groq API (text generation), Pollinations.ai (image generation)
- API: Vercel Serverless Functions

DATABASE TABLES:
- profiles: user profiles with roles, bios, social links
- posts: community feed posts
- post_comments: threaded comments on posts
- songs: uploaded music tracks
- song_purchases: purchase records and download tracking
- stories: 24-hour expiring stories
- follows: follow relationships
- friends: friend connections
- favorites: favorited content
- algorithm_points: point tracking per user
- chatroom_messages: community chat messages
- chatroom_bans: kick/ban records
- direct_messages: private messages
- message_reports: reported message queue
- artist_payouts: payment tracking for artists

CONTACT:
- Platform owner: 8bfr_Official
- Email: 8bfr.music@gmail.com
- Report issues through the chat or DM system

`;

// Export a function to get relevant knowledge for a query
window.getRelevantKnowledge = function(query) {
  const lower = query.toLowerCase();
  const sections = window.PLATFORM_KNOWLEDGE.split('============================');
  
  // Score each section by keyword relevance
  const keywords = lower.split(/\s+/).filter(w => w.length > 2);
  const scored = sections.map((section, i) => {
    let score = 0;
    keywords.forEach(kw => {
      const matches = (section.toLowerCase().match(new RegExp(kw, 'g')) || []).length;
      score += matches;
    });
    return { section, score, index: i };
  });
  
  // Return top 3 most relevant sections
  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter(s => s.score > 0).slice(0, 3);
  
  if (relevant.length === 0) return '';
  return '\n\n--- PLATFORM CONTEXT ---\n' + relevant.map(r => r.section.trim()).join('\n\n');
};

console.log('✅ 8BFR Knowledge Base loaded — ' + window.PLATFORM_KNOWLEDGE.length + ' characters');
