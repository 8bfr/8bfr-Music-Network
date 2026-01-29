// loader.js

// Attempts to load the official supabase-js bundle dynamically.

// If successful it leaves createClient/global supabase as provided by the bundle.

// Emits events on window for success/failure so the page can react.

(
function
(
)
{
  
const
 CDN = 
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.34.0/dist/bundle.js'
;
  
function
 
emit
(
name, detail
)
{
    
try
 { 
window
.dispatchEvent(
new
 CustomEvent(name, { detail })); } 
catch
(e) { 
/* ignore */
 }
  }
  
// Avoid double-loading

  
if
 (
window
.__supabase_loader_injected) {
    emit(
'supabase-loader:already'
);
    
return
;
  }
  
window
.__supabase_loader_injected = 
true
;
  
// If createClient already exists, we're done

  
if
 (
typeof
 
window
.createClient === 
'function'
 || (
window
.supabase && 
typeof
 
window
.supabase.createClient === 
'function'
)) {
    emit(
'supabase-loader:ready'
, { 
reason
: 
'already-present'
 });
    
return
;
  }
  
const
 s = 
document
.createElement(
'script'
);
  s.src = CDN;
  s.async = 
true
;
  s.onload = 
function
(
)
{
    emit(
'supabase-loader:loaded'
, { 
cdn
: CDN });
  };
  s.onerror = 
function
(
e
)
{
    emit(
'supabase-loader:error'
, { 
cdn
: CDN, 
error
: 
String
(e) });
  };
  
document
.head.appendChild(s);
  
// Timeout fallback: if neither loaded nor error within X seconds, emit timeout

  
setTimeout
(
() =>
 {
    
// If createClient still undefined, emit timeout

    
if
 (
typeof
 
window
.createClient !== 
'function'
 && !(
window
.supabase && 
typeof
 
window
.supabase.createClient === 
'function'
)) {
      emit(
'supabase-loader:timeout'
, { 
cdn
: CDN });
    }
  }, 
6000
);
})();
