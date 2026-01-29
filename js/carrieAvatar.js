import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";
let scene, camera, renderer, carrie, currentOutfit="casual";
initCarrie();
async function initCarrie() {
  renderer = new THREE.WebGLRenderer({ alpha:true });
  renderer.setSize(300,400);
  const avatarDiv=document.createElement("div");
  avatarDiv.id="carrieAvatar"; avatarDiv.style.position="fixed";
  avatarDiv.style.bottom="20px"; avatarDiv.style.right="20px";
  avatarDiv.style.cursor="move";
  document.body.appendChild(avatarDiv);
  avatarDiv.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, 300/400, 0.1, 100);
  camera.position.z = 2;
  new GLTFLoader().load("media/models/carrie_fullbody.glb", gltf=>{
    carrie=gltf.scene; scene.add(carrie);
    animate();
  });
  enableDrag(avatarDiv);
}
function animate(){requestAnimationFrame(animate);renderer.render(scene,camera);}
function enableDrag(elem){
  let pos1=0,pos2=0,pos3=0,pos4=0;
  elem.onmousedown=(e)=>{e.preventDefault();pos3=e.clientX;pos4=e.clientY;
    document.onmouseup=closeDrag;document.onmousemove=drag;};
  function drag(e){e.preventDefault();pos1=pos3-e.clientX;pos2=pos4-e.clientY;pos3=e.clientX;pos4=e.clientY;
    elem.style.top=(elem.offsetTop-pos2)+"px";elem.style.left=(elem.offsetLeft-pos1)+"px";}
  function closeDrag(){document.onmouseup=null;document.onmousemove=null;}
}
