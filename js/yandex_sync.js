const YandexSync = (() => {
  let _player      = null;
  let _saveTimer   = null;
  let _initialized = false;

  const _getPlayer = async () => {
    if (_player) return _player;
    try {
      const sdk = await window.yandexSDKPromise;
      if (!sdk) return null;
      _player = await sdk.getPlayer({ scopes: false });
      return _player;
    } catch (_) { return null; }
  };

  const _collect = () => ({
    balance:    state.balance,
    clickPower: state.clickPower,
    boosts:     BOOSTS.map(b => ({ id: b.id, owned: b.owned })),
    savedAt:    Date.now(),
  });

  const _doSave = async () => {
    const player = await _getPlayer();
    if (!player) return;
    try { await player.setData({ [CLOUD_KEY]: _collect() }, true); } catch (_) {}
  };

  const _saveLocal = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(_collect())); } catch (_) {}
  };

  const _loadLocal = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);

      // migrate from legacy separate keys (≤v1.1.7)
      const balance    = parseInt(localStorage.getItem('yc_balance'),    10);
      const clickPower = parseInt(localStorage.getItem('yc_clickPower'), 10);
      if (!isNaN(balance) || !isNaN(clickPower)) {
        return { balance: isNaN(balance) ? 0 : balance, clickPower: isNaN(clickPower) ? 1 : clickPower, boosts: [], savedAt: null };
      }
    } catch (_) {}
    return null;
  };

  const _applyData = (data) => {
    if (!data || typeof data !== 'object') return;
    if (typeof data.balance    === 'number') setBalance(Math.max(state.balance, data.balance));
    if (typeof data.clickPower === 'number') setClickPower(Math.max(state.clickPower, data.clickPower));
    if (Array.isArray(data.boosts)) {
      data.boosts.forEach(({ id, owned }) => {
        const boost = BOOSTS.find(b => b.id === id);
        if (boost && typeof owned === 'number') applyBoostOwned(boost, Math.max(boost.owned, owned));
      });
    }
  };

  const _merge = (local, cloud) => {
    if (!local && !cloud) return null;
    if (!local) return cloud;
    if (!cloud) return local;
    return (cloud.savedAt ?? 0) >= (local.savedAt ?? 0) ? cloud : local;
  };

  const save = () => {
    _saveLocal();
    if (!_initialized) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(_doSave, SAVE_DELAY);
  };

  const saveNow = () => {
    clearTimeout(_saveTimer);
    _saveLocal();
    if (_initialized) _doSave();
  };

  const init = async (onLoaded) => {
    const local  = _loadLocal();
    const player = await _getPlayer();
    let cloud    = null;

    if (player) {
      try {
        const data = await player.getData([CLOUD_KEY]);
        cloud = data?.[CLOUD_KEY] ?? null;
      } catch (_) {}
    }

    const best = _merge(local, cloud);
    if (best) _applyData(best);

    Odometer.update(state.balance, false);
    _initialized = true;
    onLoaded?.();
  };

  return { init, save, saveNow };
})();
