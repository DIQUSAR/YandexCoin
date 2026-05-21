const spawnFloatPop = (clientX, clientY) => {
  const $app = document.getElementById('app');
  const rect = $app.getBoundingClientRect();

  const el       = document.createElement('span');
  el.className   = 'float-pop';
  el.textContent = `+${formatBalance(state.clickPower)}`;
  el.style.left  = `${clientX - rect.left - 14}px`;
  el.style.top   = `${clientY - rect.top  - 20}px`;

  $app.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
};
