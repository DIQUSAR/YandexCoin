const BoostSheet = (() => {
  const $sheet       = document.getElementById('boostSheet');
  const $backdrop    = document.getElementById('sheetBackdrop');
  const $list        = document.getElementById('boostList');
  const $closeBtn    = document.getElementById('boostSheetClose');
  const $rateDisplay = document.getElementById('passiveRateDisplay');

  let _tickInterval = null;

  const _updateRateDisplay = () => {
    if (!$rateDisplay) return;
    const total = getTotalPerSec();
    $rateDisplay.textContent = total > 0
      ? `+${formatBalance(total)}${i18n.t('boostSheet.perSec')}`
      : '';
  };

  const _buildBuyBtn = (boost, cost, canAfford) => {
    const btn = document.createElement('button');
    btn.className = 'boost-row__buy';
    btn.disabled  = !canAfford;
    btn.setAttribute('aria-label', `${i18n.t('boostSheet.buy')} ${formatBalance(cost)}`);

    const text = document.createElement('span');
    text.className   = 'boost-row__buy-text';
    text.textContent = `${i18n.t('boostSheet.buy')} ${formatBalance(cost)}`;

    const coin = document.createElement('div');
    coin.className = 'boost-row__buy-coin';

    btn.append(text, coin);
    btn.addEventListener('click', () => _buy(boost));
    return btn;
  };

  const _buildInfo = (boost) => {
    const info = document.createElement('div');
    info.className = 'boost-row__info';

    const name = document.createElement('div');
    name.className   = 'boost-row__name';
    name.textContent = i18n.t(`boost.${boost.id}`);

    const rate = document.createElement('div');
    rate.className   = 'boost-row__rate';
    rate.textContent = boost.type === 'click'
      ? `+${formatBalance(boost.clickBonus)}${i18n.t('boostSheet.perClick')}`
      : `+${formatBalance(boost.perSec)}${i18n.t('boostSheet.perSec')}`;

    const owned = document.createElement('div');
    owned.className   = 'boost-row__owned';
    owned.textContent = boost.owned > 0
      ? `${boost.owned} ${i18n.t('boostSheet.owned')}`
      : '';

    info.append(name, rate, owned);
    return info;
  };

  const _createRow = (boost) => {
    const cost = getBoostCost(boost);

    const row      = document.createElement('div');
    row.className  = 'boost-row';
    row.dataset.id = boost.id;

    const icon = document.createElement('div');
    icon.className   = 'boost-row__icon';
    icon.textContent = boost.icon;

    row.append(icon, _buildInfo(boost), _buildBuyBtn(boost, cost, state.balance >= cost));
    return row;
  };

  const _render = () => {
    $list.innerHTML = '';
    BOOSTS.forEach(b => $list.appendChild(_createRow(b)));
  };

  const _buy = (boost) => {
    const cost = getBoostCost(boost);
    if (state.balance < cost) return;

    addBalance(-cost);
    applyBoostOwned(boost, boost.owned + 1);

    Odometer.update(state.balance);
    _updateRateDisplay();
    _render();
    YandexSync.save();
  };

  const open = () => {
    _render();
    $sheet.classList.add('is-open');
    $backdrop.classList.add('is-open');
    $sheet.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    $sheet.classList.remove('is-open');
    $backdrop.classList.remove('is-open');
    $sheet.setAttribute('aria-hidden', 'true');
  };

  const startTick = () => {
    if (_tickInterval) return;
    _tickInterval = setInterval(() => {
      if (document.hidden) return;
      const perSec = getTotalPerSec();
      if (perSec === 0) return;
      addBalance(perSec);
      Odometer.update(state.balance);
      if ($sheet.classList.contains('is-open')) _render();
    }, 1000);
  };

  const refresh = () => _updateRateDisplay();

  $closeBtn.addEventListener('click', close);
  $backdrop.addEventListener('click', close);

  let _touchStartY = 0;
  $sheet.addEventListener('touchstart', (e) => { _touchStartY = e.touches[0].clientY; }, { passive: true });
  $sheet.addEventListener('touchend',   (e) => { if (e.changedTouches[0].clientY - _touchStartY > 60) close(); }, { passive: true });

  return { open, close, startTick, refresh };
})();
