const pages=[...document.querySelectorAll(".page")];
const intro=document.getElementById("intro");
const openBtn=document.getElementById("openBtn");
const musicBtn=document.getElementById("musicBtn");
const autoBtn=document.getElementById("autoBtn");

let auto=true;
let autoFrame=null;
let bgAudio=null;
let musicOn=false;
let manualPauseTimer=null;
let lastTime=0;

/* LIVE COUNTDOWN — 17 August 2026, 11:46 AM IST */
c

/* CONTINUOUS INVITATION SCROLL
   The invitation moves continuously through all sections instead of
   jumping from one full page to the next. */
function startAuto(){
  stopAuto();
  if(!auto)return;
  lastTime=performance.now();

  function scroll(time){
    if(!auto)return;

    const delta=Math.min(time-lastTime,40);
    lastTime=time;

    // About 38 pixels per second: slow enough to read, but continuous.
    window.scrollBy(0,(38*delta)/1000);

    const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
    if(window.scrollY>=maxScroll-2){
      stopAuto();
      return;
    }
    autoFrame=requestAnimationFrame(scroll);
  }
  autoFrame=requestAnimationFrame(scroll);
}

function stopAuto(){
  if(autoFrame){
    cancelAnimationFrame(autoFrame);
    autoFrame=null;
  }
}

function pauseForManualScroll(){
  stopAuto();
  clearTimeout(manualPauseTimer);
  manualPauseTimer=setTimeout(()=>{
    if(auto)startAuto();
  },3000);
}

function startMusic(){
  if(musicOn)return;
  bgAudio=new Audio("music/radha-ramanam.mp3");
  bgAudio.loop=true;
  bgAudio.volume=.55;
  bgAudio.play().then(()=>{
    musicOn=true;
    musicBtn.textContent="♫ Music On";
  }).catch(()=>{
    musicBtn.textContent="♫ Tap Music";
  });
}

function stopMusic(){
  musicOn=false;
  musicBtn.textContent="♫ Music Off";
  if(bgAudio){
    bgAudio.pause();
    bgAudio.currentTime=0;
    bgAudio=null;
  }
}

openBtn.addEventListener("click",()=>{
  intro.classList.add("hide");
  startMusic();
  startAuto();
});

musicBtn.addEventListener("click",()=>{
  musicOn?stopMusic():startMusic();
});

autoBtn.addEventListener("click",()=>{
  auto=!auto;
  autoBtn.textContent=auto?"↕ Auto Scroll":"↕ Auto Off";
  if(auto)startAuto();
  else stopAuto();
});

["wheel","touchstart","touchmove","pointerdown"].forEach(evt=>{
  window.addEventListener(evt,()=>{
    if(document.body.classList.contains("opened")) pauseForManualScroll();
  },{passive:true});
});
