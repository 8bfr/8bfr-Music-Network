```javascript
// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://novbuvwpjnxwwvdekjhr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== FLOATING BUBBLES ANIMATION =====
function createFloatingBubbles() {
    const bubblesContainer = document.querySelector('.floating-bubbles');
    if (!bubblesContainer) return;

    const bubbleCount = 15;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = Math.random() * 70 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 15 + 10;
        bubble.style.animationDuration = `${duration}s`;
        
        const delay = Math.random() * 5;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.opacity = Math.random() * 0.3 + 0.1;
        
        bubblesContainer.appendChild(bubble);
    }
}

// ===== FLOATING HAMBURGER =====
function createFloatingHamburger() {
    const hamburgerContainer = document.querySelector('.floating-hamburger');
    if (!hamburgerContainer) return;

    for (let i = 0; i < 5; i++) {
        const hamburger = document.createElement('div');
        hamburger.className = 'mini-hamburger';
        hamburger.innerHTML = '☰';
        
        hamburger.style.left = `${Math.random() * 100}%`;
        hamburger.style.animationDuration = `${Math.random() * 10 + 8}s`;
        hamburger.style.animationDelay = `${Math.random() * 3}s`;
        hamburger.style.fontSize = `${Math.random() * 20 + 15}px`;
        
        hamburgerContainer.appendChild(hamburger);
    }
}

// ===== FLOATING AVATARS =====
function createFloatingAvatars() {
    const avatarContainer = document.querySelector('.floating-avatars');
    if (!avatarContainer) return;

    const avatarEmojis = ['👤', '🎤', '🎧', '🎸', '🎹', '🎵', '🎶', '💿', '🎚️', '🎛️'];
    
    for (let i = 0; i < 8; i++) {
        const avatar = document.createElement('div');
        avatar.className = 'floating-avatar';
        avatar.textContent = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
        
        avatar.style.left = `${Math.random() * 100}%`;
        avatar.style.animationDuration = `${Math.random() * 12 + 10}s`;
        avatar.style.animationDelay = `${Math.random() * 4}s`;
        avatar.style.fontSize = `${Math.random() * 30 + 20}px`;
        
        avatarContainer.appendChild(avatar);
    }
}

// ===== HAMBURGER MENU TOGGLE =====
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.menu-overlay');
    
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ===== PROFILE NAVIGATION UPDATES =====
function updateProfileLinks() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Remove old individual profile links (artist-profile.html, beatmaker-profile.html, etc.)
    const allLinks = navMenu.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('-profile.html') && href !== 'profile.html' && href !== 'profiles.html' && href !== 'create-profile.html') {
            link.parentElement?.remove();
        }
    });

    // Check if new profile links already exist
    const hasMyProfile = navMenu.querySelector('a[href="profile.html"]');
    const hasAllProfiles = navMenu.querySelector('a[href="profiles.html"]');
    const hasCreateProfile = document.getElementById('createProfileLink');

    // Add My Profile link if it doesn't exist
    if (!hasMyProfile) {
        const myProfileLi = document.createElement('li');
        myProfileLi.innerHTML = '<a href="profile.html">👤 My Profile</a>';
        navMenu.appendChild(myProfileLi);
    }

    // Add All Profiles link if it doesn't exist
    if (!hasAllProfiles) {
        const allProfilesLi = document.createElement('li');
        allProfilesLi.innerHTML = '<a href="profiles.html">👥 All Profiles</a>';
        navMenu.appendChild(allProfilesLi);
    }

    // Add Create Profile link if it doesn't exist (hidden by default)
    if (!hasCreateProfile) {
        const createProfileLi = document.createElement('li');
        createProfileLi.id = 'createProfileLink';
        createProfileLi.style.display = 'none';
        createProfileLi.innerHTML = '<a href="create-profile.html">➕ Create Profile</a>';
        navMenu.appendChild(createProfileLi);
    }

    // Check if user is owner to show create profile link
    checkIfOwner();
}

// ===== CHECK IF USER IS OWNER =====
async function checkIfOwner() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase.from('profiles').select('role').eq('user_id', user.id).single();
            if (profile?.role === 'owner') {
                const createLink = document.getElementById('createProfileLink');
                if (createLink) {
                    createLink.style.display = 'block';
                }
            }
        }
    } catch (error) {
        console.error('Error checking owner status:', error);
    }
}

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Create all floating elements
    createFloatingBubbles();
    createFloatingHamburger();
    createFloatingAvatars();
    
    // Initialize profile links
    updateProfileLinks();
    
    // Menu overlay click handler
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }
    
    // Close menu when clicking a link
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            menu.classList.remove('active');
            hamburger.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    });
});

// ===== BACK TO TOP BUTTON =====
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== AUTH STATE LISTENER =====
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        updateProfileLinks();
    } else if (event === 'SIGNED_OUT') {
        const createLink = document.getElementById('createProfileLink');
        if (createLink) {
            createLink.style.display = 'none';
        }
    }
});
```

**✅ DONE! This preserves:**
- ✅ Floating bubbles
- ✅ Floating hamburger
- ✅ Floating avatars
- ✅ All existing functionality

**AND ADDS:**
- ✅ Removes old profile links (artist-profile, beatmaker-profile, etc.)
- ✅ Adds profile.html (My Profile)
- ✅ Adds profiles.html (All Profiles)
- ✅ Adds create-profile.html (Create Profile - owner only)
- ✅ Owner check to show/hide create profile link
