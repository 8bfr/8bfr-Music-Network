function getPoint(e) {  
  if (e.touches && e.touches.length) {  
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };  
  }  
  return { x: e.clientX, y: e.clientY };  
}  

function onDown(e) {  
  dragging = true;  
  const p = getPoint(e);  
  sx = p.x;  
  sy = p.y;  
  const r = carrieWrap.getBoundingClientRect();  
  ox = r.left;  
  oy = r.top;  
  carrieWrap.style.right = "auto";  
  carrieWrap.style.bottom = "auto";  
  // no preventDefault here so taps still produce click (for chat)  
}  

function onMove(e) {  
  if (!dragging) return;  
  const p = getPoint(e);  
  const dx = p.x - sx;  
  const dy = p.y - sy;  
  carrieWrap.style.left = ox + dx + "px";  
  carrieWrap.style.top  = oy + dy + "px";  
}  

function onUp() {  
  dragging = false;  
}  

carrieWrap.addEventListener("mousedown", onDown);  
carrieWrap.addEventListener("touchstart", onDown, { passive: true });  
window.addEventListener("mousemove", onMove, { passive: false });  
window.addEventListener("touchmove", onMove, { passive: false });  
window.addEventListener("mouseup", onUp);  
window.addEventListener("touchend", onUp);  

if (carrieVideo) {  
  carrieVideo.addEventListener("click", function (e) {  
    e.stopPropagation();  
    window.location.href = "carrie-chat.html";  
  });  
}

}

if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", injectGlobalUI);
} else {
injectGlobalUI();
}
})();
