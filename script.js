const pages = [...document.querySelectorAll('.page')];
const intro = document.getElementById('intro');
const openBtn = document.getElementById('openBtn');
const musicBtn = document.getElementById('musicBtn');
const autoBtn = document.getElementById('autoBtn');
const countdown = document.getElementById('countdown');

let auto = true;
let autoFrame = null;
let bgAudio = null;
let musicOn = false;
let manualPauseTimer = null;
let lastTime = 0;

// Engagement: 17 August 2026, 11:46 AM India Standard Time (UTC+05:30)
const eventTime = new Date('2026-08-17T11:46:00+05:30').getTime();

function updateCountdown() {
  if (!countdown) return;
  const remaining = Math.max(0, eventTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.querySelector('[data-days]').textContent = String(days).padStart(2, '0');
  countdown.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
  countdown.querySelector('[data-minutes]').textContent = String(minutes).padStart(2, '0');
  countdown.querySelector('[data-seconds]').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

function startAuto() {
  stopAuto();
  if (!auto) return;
  lastTime = performance.now();
  function scroll(time) {
    if (!auto) return;
    const delta = Math.min(time - lastTime, 40);
    lastTime = time;
    window.scrollBy(0, (38 * delta) / 1000);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 2) { stopAuto(); return; }
    autoFrame = requestAnimationFrame(scroll);
  }
  autoFrame = requestAnimationFrame(scroll);
}

function stopAuto() {
  if (autoFrame) cancelAnimationFrame(autoFrame);
  autoFrame = null;
}

function pauseForManualScroll() {
  stopAuto();
  clearTimeout(manualPauseTimer);
  manualPauseTimer = setTimeout(() => { if (auto && document.body.classList.contains('opened')) startAuto(); }, 3000);
}

function startMusic() {
  if (musicOn) return;
  bgAudio = new Audio('music/radha-ramanam.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.55;
  bgAudio.play().then(() => {
    musicOn = true;
    if (musicBtn) musicBtn.textContent = '♫ Music On';
  }).catch(() => {
    if (musicBtn) musicBtn.textContent = '♫ Tap Music';
  });
}

function stopMusic() {
  musicOn = false;
  if (musicBtn) musicBtn.textContent = '♫ Music Off';
  if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; bgAudio = null; }
}

// This is the important Open Invitation handler.
openBtn.addEventListener('click', function () {
  intro.classList.add('hide');
  document.body.classList.add('opened');
  window.scrollTo({ top: 0, behavior: 'instant' });
  startMusic();
  setTimeout(startAuto, 850);
});

musicBtn.addEventListener('click', () => musicOn ? stopMusic() : startMusic());

autoBtn.addEventListener('click', () => {
  auto = !auto;
  autoBtn.textContent = auto ? '↕ Auto Scroll' : '↕ Auto Off';
  if (auto) startAuto(); else stopAuto();
});

['wheel', 'touchstart', 'touchmove', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (document.body.classList.contains('opened')) pauseForManualScroll();
  }, { passive: true });
});
