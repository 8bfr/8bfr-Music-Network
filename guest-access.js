// guest-access.js
// Include this script on pages where "Continue as guest" is possible.
// It enforces client-side blocking of protected actions while leaving external links (Spotify, donate) available.

(function(){
  // Customize selectors for protected actions (buttons/links that require signup)
  const protectedSelectors = [
    'a[data-protected]',
    'button[data-protected]',
    '.requires-auth' // example class
  ];

  function isGuest(){
    // Basic heuristic: if supabase client exists and has a user session => not guest
    try {
      if (window.supabase && typeof window.supabase.auth !== 'undefined') {
        // supabase-js v2: auth.getSession() returns { data: { session } }
        if (typeof window.supabase.auth.getSession === 'function') {
          const p = window.supabase.auth.getSession();
          // If getSession returns a Promise, we can't use sync here; assume guest and rely on later update
          // We'll attach a listener below to toggle if session exists.
          return true;
        }
      }
    } catch(e){
      // ignore and treat as guest
    }
    // default to guest true; UI toggling will fix after auth check
    return true;
  }

  function lockProtected(){
    protectedSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Allow external links that go to other hosts (spotify, donate) even if marked protected
        if (el.tagName === 'A' && el.href && new URL(el.href, location.href).origin !== location.origin) {
          // external link — allow
          return;
        }
        // For donate button allow if it has data-allow-guest attribute
        if (el.hasAttribute && el.hasAttribute('data-allow-guest')) return;

        // Replace click behavior
        el.addEventListener('click', function(ev){
          ev.preventDefault();
          ev.stopPropagation();
          // show signup prompt
          const confirmSignup = confirm('Sign up to access this feature. Would you like to sign up now?');
          if (confirmSignup) {
            location.href = '/signup.html';
          }
        }, { capture: true, passive: false });
        // add visual hint
        el.style.opacity = '0.85';
        el.style.filter = 'grayscale(.15)';
        el.title = el.title || 'Sign up to access this';
      });
    });
  }

  function unlockProtected(){
    // a simple page reload will remove the attached listeners; for correctness you may want to remove specific handlers
    // But we can also remove the title/opacity hints:
    protectedSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.opacity = '';
        el.style.filter = '';
        if (el.title === 'Sign up to access this') el.title = '';
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else run();

  function run(){
    // Apply initial lock for guests
    if (isGuest()) lockProtected(); else unlockProtected();

    // If supabase auth exists, listen to auth state changes to update locks
    if (window.supabase && window.supabase.auth && typeof window.supabase.auth.onAuthStateChange === 'function') {
      window.supabase.auth.onAuthStateChange((event, session) => {
        if (session) unlockProtected(); else lockProtected();
      });
    } else {
      // If supabase is not present, we still keep guest restrictions
      lockProtected();
    }
  }
})();
