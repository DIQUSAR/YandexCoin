const GameReady = (() => {
  let _playing = false;
  let _hidden  = false;

  const _sdkCall = async (fn) => {
    try { const sdk = await window.yandexSDKPromise; if (sdk) fn(sdk); } catch (_) {}
  };

  const start = () => {
    if (_playing || _hidden) return;
    _playing = true;
    _sdkCall(sdk => sdk.features.GameplayAPI?.start());
  };

  const stop = () => {
    if (!_playing) return;
    _playing = false;
    _sdkCall(sdk => sdk.features.GameplayAPI?.stop());
    YandexSync.saveNow();
  };

  const init = () => {
    const onHide = () => { _hidden = true;  stop(); };
    const onShow = () => { _hidden = false; };

    document.addEventListener('visibilitychange', () => document.hidden ? onHide() : onShow());
    window.addEventListener('pagehide',         onHide);
    window.addEventListener('yndx-game-pause',  onHide);
    window.addEventListener('yndx-game-resume', onShow);
  };

  return { init, start, stop };
})();
