// kidzone-menu.js
// Include on ALL KidZone pages: <script src="kidzone-menu.js" defer></script>
// Injects hamburger menu + kid avatar + slide-out navigation
(function(){

// Inject CSS
var style=document.createElement('style');
style.textContent='\
#kzHamburger{position:fixed;top:12px;left:12px;z-index:9999;display:flex;align-items:center;gap:8px;cursor:pointer;}\
#kzHamBtn{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:2px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(139,92,246,.4);}\
#kzHamBtn .bars{display:flex;flex-direction:column;gap:3px;}\
#kzHamBtn .bar{height:2.5px;background:#fff;border-radius:2px;transition:all .3s;}\
#kzHamBtn .bar:nth-child(1){width:18px;}\
#kzHamBtn .bar:nth-child(2){width:14px;}\
#kzHamBtn .bar:nth-child(3){width:18px;}\
#kzHamBtn.open .bar:nth-child(1){transform:rotate(45deg) translate(4px,4px);width:18px;}\
#kzHamBtn.open .bar:nth-child(2){opacity:0;width:0;}\
#kzHamBtn.open .bar:nth-child(3){transform:rotate(-45deg) translate(4px,-4px);width:18px;}\
#kzAvatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f97316);border:3px solid #fff;box-shadow:0 2px 12px rgba(251,191,36,.4);display:flex;align-items:center;justify-content:center;position:relative;overflow:visible;animation:kzBounce 3s ease-in-out infinite;}\
#kzAvatar .face{font-size:0;position:relative;width:28px;height:28px;}\
#kzAvatar .eyes{position:absolute;top:6px;left:3px;display:flex;gap:8px;}\
#kzAvatar .eye{width:6px;height:7px;background:#1a0533;border-radius:50%;position:relative;animation:kzBlink 4s ease-in-out infinite;}\
#kzAvatar .eye::after{content:"";position:absolute;top:1px;left:1.5px;width:2px;height:2px;background:#fff;border-radius:50%;}\
#kzAvatar .mouth{position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:12px;height:6px;border-radius:0 0 6px 6px;background:#e11d48;overflow:hidden;}\
#kzAvatar .mouth::after{content:"";position:absolute;bottom:0;left:2px;width:8px;height:3px;background:#fca5a5;border-radius:4px 4px 0 0;}\
#kzAvatar .cheek{position:absolute;top:12px;width:6px;height:4px;background:rgba(251,113,133,.4);border-radius:50%;}\
#kzAvatar .cheek.l{left:0;}\
#kzAvatar .cheek.r{right:0;}\
#kzAvatar .hat{position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:22px;height:12px;background:linear-gradient(135deg,#8b5cf6,#a855f7);border-radius:8px 8px 2px 2px;border:1.5px solid rgba(255,255,255,.3);}\
#kzAvatar .hat::before{content:"";position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:6px;height:6px;background:#fbbf24;border-radius:50%;}\
#kzAvatar .note{position:absolute;top:-6px;right:-8px;font-size:12px;animation:kzNote 2s ease-in-out infinite;opacity:.8;}\
@keyframes kzBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-3px);}}\
@keyframes kzBlink{0%,45%,55%,100%{transform:scaleY(1);}50%{transform:scaleY(0.1);}}\
@keyframes kzNote{0%,100%{transform:translateY(0) rotate(-10deg);opacity:.8;}50%{transform:translateY(-6px) rotate(10deg);opacity:1;}}\
#kzMenuPanel{display:none;position:fixed;top:0;left:0;width:280px;height:100vh;background:linear-gradient(180deg,rgba(15,10,35,.98),rgba(26,5,51,.98));border-right:2px solid rgba(139,92,246,.25);z-index:9998;overflow-y:auto;padding:0 0 90px;backdrop-filter:blur(16px);}\
#kzMenuHeader{padding:20px;background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(236,72,153,.08));border-bottom:1px solid rgba(139,92,246,.15);display:flex;align-items:center;gap:12px;}\
#kzMenuHeader .menu-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f97316);border:3px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;}\
#kzMenuHeader .menu-info h2{font-family:"Fredoka One",cursive;font-size:1.2rem;color:#c4b5fd;margin:0;}\
#kzMenuHeader .menu-info p{font-size:.68rem;color:rgba(168,130,255,.5);margin:2px 0 0;}\
.kzml{display:flex;align-items:center;gap:12px;padding:12px 18px;text-decoration:none;color:#d4c5f9;font-size:.9rem;font-weight:600;transition:all .15s;border-left:3px solid transparent;margin:1px 0;}\
.kzml:hover,.kzml.kz-active{background:rgba(139,92,246,.1);color:#e9d5ff;border-left-color:#8b5cf6;}\
.kzml .ml-icon{width:28px;height:28px;border-radius:8px;background:rgba(139,92,246,.12);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}\
.kzml.kz-active .ml-icon{background:rgba(139,92,246,.25);}\
.kz-divider{height:1px;background:rgba(139,92,246,.1);margin:8px 18px;}\
#kzMenuOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9997;}\
.kz-profile-card{margin:12px 14px;padding:12px;background:rgba(139,92,246,.06);border:1px solid rgba(139,92,246,.12);border-radius:12px;display:flex;align-items:center;gap:10px;}\
.kz-profile-card .kzpc-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:18px;}\
.kz-profile-card .kzpc-info{flex:1;}\
.kz-profile-card .kzpc-name{font-size:.82rem;font-weight:700;color:#e9d5ff;}\
.kz-profile-card .kzpc-xp{font-size:.68rem;color:rgba(168,130,255,.5);}';
document.head.appendChild(style);

// Inject HTML
var wrapper=document.createElement('div');
wrapper.innerHTML='\
<div id="kzHamburger">\
  <div id="kzHamBtn"><div class="bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>\
  <div id="kzAvatar"><div class="face"><div class="hat"></div><div class="eyes"><div class="eye"></div><div class="eye"></div></div><div class="cheek l"></div><div class="cheek r"></div><div class="mouth"></div></div><span class="note">&#9835;</span></div>\
</div>\
<div id="kzMenuOverlay"></div>\
<div id="kzMenuPanel">\
  <div id="kzMenuHeader"><div class="menu-avatar">&#129490;</div><div class="menu-info"><h2>KidZone</h2><p>Safe space for young creators</p></div></div>\
  <div class="kz-profile-card" id="kzProfileCard" style="display:none;"><div class="kzpc-avatar">&#129490;</div><div class="kzpc-info"><div class="kzpc-name" id="kzPcName">-</div><div class="kzpc-xp" id="kzPcXp">-</div></div></div>\
  <a href="kid-zone.html" class="kzml"><span class="ml-icon">&#127968;</span>Home</a>\
  <a href="kidzone-creators.html" class="kzml"><span class="ml-icon">&#11088;</span>Creators</a>\
  <a href="kidzone-studio.html" class="kzml"><span class="ml-icon">&#127929;</span>Studio</a>\
  <a href="kidzone-challenges.html" class="kzml"><span class="ml-icon">&#127942;</span>Challenges</a>\
  <a href="kidzone-games.html" class="kzml"><span class="ml-icon">&#127918;</span>Games</a>\
  <a href="kidzone-rewards.html" class="kzml"><span class="ml-icon">&#127873;</span>Rewards</a>\
  <a href="kidzone-members.html" class="kzml"><span class="ml-icon">&#128101;</span>Members</a>\
  <a href="kids-stories.html" class="kzml"><span class="ml-icon">&#128214;</span>Stories</a>\
  <a href="kids-games.html" class="kzml"><span class="ml-icon">&#127922;</span>Mini Games</a>\
  <div class="kz-divider"></div>\
  <a href="kidzone_parent.html" class="kzml" style="color:#f97316;"><span class="ml-icon" style="background:rgba(249,115,22,.12);">&#128119;</span>Parent Hub</a>\
  <div class="kz-divider"></div>\
  <a href="feed.html" class="kzml" style="color:rgba(168,130,255,.35);"><span class="ml-icon" style="background:rgba(139,92,246,.06);">&#8592;</span>Back to Main Site</a>\
</div>';

// Append all children
while(wrapper.firstChild){document.body.appendChild(wrapper.firstChild);}

// Menu toggle
var _kzOpen=false;
document.getElementById('kzHamburger').addEventListener('click',function(){
  _kzOpen=!_kzOpen;
  document.getElementById('kzMenuPanel').style.display=_kzOpen?'block':'none';
  document.getElementById('kzMenuOverlay').style.display=_kzOpen?'block':'none';
  document.getElementById('kzHamBtn').classList.toggle('open',_kzOpen);
});
document.getElementById('kzMenuOverlay').addEventListener('click',function(){
  _kzOpen=false;
  document.getElementById('kzMenuPanel').style.display='none';
  document.getElementById('kzMenuOverlay').style.display='none';
  document.getElementById('kzHamBtn').classList.remove('open');
});

// Highlight current page
var page=location.pathname.split('/').pop()||'';
document.querySelectorAll('.kzml').forEach(function(a){
  if(a.getAttribute('href')===page)a.classList.add('kz-active');
});

// Suppress adult site hamburger menu
setTimeout(function(){
  var ham=document.querySelector('.hamburger-menu,.ham-menu,#hamburgerMenu,[class*="hamburger"]');
  if(ham)ham.remove();
  document.querySelectorAll('nav').forEach(function(n){if(n.id!=='kidNav')n.remove();});
  document.querySelectorAll('.avatar-bubble,.chat-bubble-float,[onclick*="hideAvatarBubbles"]').forEach(function(e){e.remove();});
  var avToggle=document.querySelector('button[style*="position:fixed"][style*="top:80px"]');
  if(avToggle)avToggle.remove();
},500);

// Load kid profile for menu card
try{
  if(window.supabase){
    var kzDb=window.supabase.createClient(
      'https://novbuvwpjnxwwvdekjhr.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmJ1dndwam54d3d2ZGVramhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODkxODUsImV4cCI6MjA3Njc2NTE4NX0.1UUkdGafh6ZplAX8hi7Bvj94D2gvFQZUl0an1RvcSA0'
    );
    kzDb.auth.getSession().then(function(s){
      if(!s.data.session)return;
      var uid=s.data.session.user.id;
      kzDb.from('kid_profiles').select('kid_display_name,xp,coins').eq('parent_id',uid).limit(1).then(function(r){
        if(r.data&&r.data.length){
          var k=r.data[0];
          document.getElementById('kzProfileCard').style.display='flex';
          document.getElementById('kzPcName').textContent=k.kid_display_name||'Kid';
          document.getElementById('kzPcXp').textContent=(k.xp||0)+' XP | '+(k.coins||0)+' coins';
        }
      });
    });
  }
}catch(e){}

})();
