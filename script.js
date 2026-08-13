const pages=[...document.querySelectorAll('.page')];
const intro=document.getElementById('intro');
const openBtn=document.getElementById('openBtn');
const musicBtn=document.getElementById('musicBtn');
const autoBtn=document.getElementById('autoBtn');
let auto=true, timer=null, audioCtx=null, gain=null, musicOn=false, melodyTimer=null;

function startAuto(){
  stopAuto();
  if(!auto) return;
  timer=setInterval(()=>{
    const y=window.scrollY;
    const h=window.innerHeight;
    let index=Math.round(y/h);
    index=Math.min(index+1,pages.length-1);
    window.scrollTo({top:index*h,behavior:'smooth'});
    if(index===pages.length-1) stopAuto();
  },6500);
}
function stopAuto(){if(timer){clearInterval(timer);timer=null}}

let bgAudio=null;
function startSoftMusic(){
  if(musicOn) return;
  bgAudio = new Audio("music/radha-ramanam.mp3");
  bgAudio.loop = true;
  bgAudio.volume = 0.55;
  bgAudio.play().then(()=>{
    musicOn=true;
    musicBtn.textContent='♫ Music On';
  }).catch(()=>{
    musicBtn.textContent='♫ Tap Music';
  });
}
function stopMusic(){
  musicOn=false;
  musicBtn.textContent='♫ Music Off';
  if(bgAudio){
    bgAudio.pause();
    bgAudio.currentTime=0;
    bgAudio=null;
  }
}
openBtn.addEventListener('click',()=>{
  intro.classList.add('hide');
  document.body.classList.add('opened');
  startSoftMusic(); startAuto();
});
musicBtn.addEventListener('click',()=>musicOn?stopMusic():startSoftMusic());
autoBtn.addEventListener('click',()=>{
  auto=!auto;
  autoBtn.textContent=auto?'↕ Auto Scroll':'↕ Auto Off';
  auto?startAuto():stopAuto();
});
let scrollStop;
window.addEventListener('wheel',()=>{clearTimeout(scrollStop);stopAuto();scrollStop=setTimeout(()=>{if(auto)startAuto()},2500)},{passive:true});
window.addEventListener('touchmove',()=>{clearTimeout(scrollStop);stopAuto();scrollStop=setTimeout(()=>{if(auto)startAuto()},2500)},{passive:true});

// Clicking anywhere on the location button opens the supplied Google Maps URL.
document.querySelector('.map-hotspot').addEventListener('click',()=>{});
