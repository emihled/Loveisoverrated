const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const finalScreen = document.getElementById('finalScreen');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const startAgainBtn = document.getElementById('startAgainBtn');
const noFoolBtn = document.getElementById('noFoolBtn');
const finalBtn = document.getElementById('finalBtn');

const dodgeButtons = [noBtn, noFoolBtn].filter(Boolean);

function moveDodgeButton(button) {
  if (!button) return;

  const zone = button.parentElement;
  if (!zone) return;

  const zoneRect = zone.getBoundingClientRect();
  const padding = 8;
  const buttonWidth = button.offsetWidth || 120;
  const buttonHeight = button.offsetHeight || 52;
  const maxX = Math.max(0, zoneRect.width - buttonWidth - padding * 2);
  const maxY = Math.max(0, zoneRect.height - buttonHeight - padding * 2);

  const x = (Math.random() * maxX) + padding;
  const y = (Math.random() * maxY) + padding;

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.style.transform = 'none';
  button.style.transition = 'left 0.12s ease, top 0.12s ease';
}

function moveNoButton() {
  moveDodgeButton(noBtn);
}

function moveNoFoolButton() {
  moveDodgeButton(noFoolBtn);
}

function showSuccess() {
  if (questionScreen) questionScreen.classList.remove('active');
  if (successScreen) successScreen.classList.add('active');
  if (finalScreen) finalScreen.classList.remove('active');
}

function showFinalScreen() {
  if (successScreen) successScreen.classList.remove('active');
  if (finalScreen) finalScreen.classList.add('active');
}

function initializeLandingScreen() {
  if (questionScreen) questionScreen.classList.add('active');
  if (successScreen) successScreen.classList.remove('active');
  if (finalScreen) finalScreen.classList.remove('active');

  if (noBtn) {
    noBtn.style.left = '50%';
    noBtn.style.top = '50%';
    noBtn.style.transform = 'translate(-50%, -50%)';
  }

  if (noFoolBtn) {
    noFoolBtn.style.left = '50%';
    noFoolBtn.style.top = '72%';
    noFoolBtn.style.transform = 'translate(-50%, -50%)';
  }
}

function resetQuestion() {
  initializeLandingScreen();
}

function handleDodgeApproach(event, button) {
  if (!button || button.offsetParent === null) return;

  const rect = button.getBoundingClientRect();
  const x = event.clientX ?? (event.touches && event.touches[0] ? event.touches[0].clientX : null);
  const y = event.clientY ?? (event.touches && event.touches[0] ? event.touches[0].clientY : null);

  if (x === null || y === null) return;

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distanceX = x - centerX;
  const distanceY = y - centerY;

  if (Math.abs(distanceX) < 175 && Math.abs(distanceY) < 175) {
    if (button === noBtn) moveNoButton();
    if (button === noFoolBtn) moveNoFoolButton();
  }
}

if (yesBtn) yesBtn.addEventListener('click', showSuccess);
if (startAgainBtn) startAgainBtn.addEventListener('click', showFinalScreen);
if (finalBtn) finalBtn.addEventListener('click', resetQuestion);

window.addEventListener('pageshow', initializeLandingScreen);
window.addEventListener('load', initializeLandingScreen);
initializeLandingScreen();

function bindRunAway(button, mover) {
  if (!button) return;

  button.addEventListener('mouseenter', mover);
  button.addEventListener('focus', mover);
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    mover();
  });
  button.addEventListener('click', (event) => {
    event.preventDefault();
    mover();
  });
  button.addEventListener('touchstart', (event) => {
    event.preventDefault();
    mover();
  }, { passive: false });
}

bindRunAway(noBtn, moveNoButton);
bindRunAway(noFoolBtn, moveNoFoolButton);

document.addEventListener('pointermove', (event) => {
  dodgeButtons.forEach((button) => handleDodgeApproach(event, button));
});

document.addEventListener('touchmove', (event) => {
  dodgeButtons.forEach((button) => handleDodgeApproach(event, button));
}, { passive: true });

window.addEventListener('resize', () => {
  if (questionScreen.classList.contains('active')) {
    moveNoButton();
  }
  if (successScreen.classList.contains('active')) {
    moveNoFoolButton();
  }
});
