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
        
        // Random size between 10px and 80px
        const size = Math.random() * 70 + 10;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random horizontal position
        bubble.style.left = `${Math.random() * 100}%`;
        
        // Random animation duration between 10s and 25s
        const duration = Math.random() * 15 + 10;
        bubble.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        bubble.style.animationDelay = `${delay}s`;
        
        // Random opacity
        bubble.style.opacity = Math.random() * 0.3 + 0.1;
        
        bubblesContainer.appendChild(bubble);
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
    // Find the nav menu
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) return;

    // Remove old profile links (artist-profile, beatmaker-profile, etc.)
    const oldProfileLinks = navMenu.querySelectorAll('a[href*="-profile.html"]');
    oldProfileLinks.forEach(link => {
        // Don't remove profile.html or profiles.html
        if (!link.href.includes('profile.html') && !link.href.includes('profiles.html')) {
            link.parentElement?.remove();
        }
    });

    // Check if new profile links already exist
    const hasMyProfile = navMenu.querySelector('a[href="profile.html"]');
    const hasAllProfiles = navMenu.querySelector('a[href="profiles.html"]');
    const hasCreateProfile = document.getElementById('createProfileLink');

    if (!hasMyProfile) {
        const myProfileLi = document.createElement('li');
        myProfileLi.innerHTML = '<a href="profile.html">👤 My Profile</a>';
        navMenu.appendChild(myProfileLi);
    }

    if (!hasAllProfiles) {
        const allProfilesLi = document.createElement('li');
        allProfilesLi.innerHTML = '<a href="profiles.html">👥 All Profiles</a>';
        navMenu.appendChild(allProfilesLi);
    }

    if (!hasCreateProfile) {
        const createProfileLi = document.createElement('li');
        createProfileLi.id = 'createProfileLink';
        createProfileLi.style.display = 'none';
        createProfileLi.innerHTML = '<a href="create-profile.html">➕ Create Profile</a>';
        navMenu.appendChild(createProfileLi);
    }

    // Check if user is owner
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
    // Create floating bubbles
    createFloatingBubbles();
    
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

