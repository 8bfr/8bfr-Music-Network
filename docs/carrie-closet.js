function addOverlayImg(itemObj){
  const host = document.getElementById("closetOverlayHost");
  if(!host) return;

  const src = (document.body.dataset.skin==="dark" && itemObj.imgDark)
    ? itemObj.imgDark
    : itemObj.img;

  const z = zBySlot[itemObj.slot] || 20;

  function make(cls){
    const img=document.createElement("img");
    img.src=src;
    img.className=`layer-overlay item-${itemObj.id} ${cls||""}`;
    img.style.zIndex=z;
    host.appendChild(img);
  }

  if(itemObj.slot==="ears"){
    make("layer-ears-left");
    make("layer-ears-right");
    return;
  }

  if(itemObj.slot==="eyes"){
    make("layer-eyes-left");
    make("layer-eyes-right");
    return;
  }

  if(itemObj.slot==="shoes"){
    make("layer-shoes-left");
    make("layer-shoes-right");
    return;
  }

  make("");
}
