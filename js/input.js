document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('touchstart', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

const handleClick = (clientX, clientY) => {
  GameReady.start();
  addBalance(state.clickPower);
  Odometer.update(state.balance);
  spawnFloatPop(clientX, clientY);
  AudioManager.playClick();
  YandexSync.save();
};

const $clickBtn   = document.getElementById('clickBtn');
let _touchHandled = false;
let _pressTimer   = null;

const _pressStart = () => { clearTimeout(_pressTimer); $clickBtn.classList.add('is-pressed'); };
const _pressEnd   = () => { _pressTimer = setTimeout(() => $clickBtn.classList.remove('is-pressed'), MIN_PRESS_MS); };

$clickBtn.addEventListener('touchstart',  () => { _touchHandled = false; _pressStart(); }, { passive: true });
$clickBtn.addEventListener('touchcancel', () => { _touchHandled = false; _pressEnd(); },   { passive: true });
$clickBtn.addEventListener('touchend', (e) => {
  if (e.cancelable) e.preventDefault();
  _touchHandled = true;
  _pressEnd();
  const t = e.changedTouches[0];
  handleClick(t.clientX, t.clientY);
}, { passive: false });

$clickBtn.addEventListener('click', (e) => {
  if (_touchHandled) { _touchHandled = false; return; }
  handleClick(e.clientX, e.clientY);
});

document.getElementById('btnBoost')?.addEventListener('click',    () => BoostSheet.open());
document.getElementById('btnGetBoost')?.addEventListener('click', () => BoostSheet.open());

['btnRating', 'btnSettings'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', () => console.info(`[Nav] ${id} tapped`));
});
