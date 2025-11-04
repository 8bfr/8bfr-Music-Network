(function(){
  const container = document.getElementById("banner");
  if (!container) return;
  const slides = container.querySelectorAll(".banner-slide");
  let i = 0;
  function show(n){ slides.forEach((s,idx)=> s.style.display = (idx===n) ? "block" : "none"); }
  if (slides.length===0) return;
  show(0); setInterval(()=>{ i=(i+1)%slides.length; show(i); }, 4000);
})();
