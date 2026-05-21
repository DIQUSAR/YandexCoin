const Adv = (() => {
  let _lastFullscreenAt = 0;

  const _sdk = async () => {
    try { return (await window.yandexSDKPromise) || null; } catch (_) { return null; }
  };

  const showFullscreen = async ({ onClose } = {}) => {
    const sdk = await _sdk();
    if (!sdk) { onClose?.(false); return; }

    if (Date.now() - _lastFullscreenAt < FULLSCREEN_AD_COOLDOWN) {
      onClose?.(false);
      return;
    }

    sdk.adv.showFullscreenAdv({
      callbacks: {
        onClose: (wasShown) => { _lastFullscreenAt = Date.now(); onClose?.(wasShown); },
        onError: () => onClose?.(false),
      },
    });
  };

  const showRewarded = async ({ onRewarded, onClose } = {}) => {
    const sdk = await _sdk();
    if (!sdk) { onClose?.(false); return; }

    sdk.adv.showRewardedVideo({
      callbacks: {
        onRewarded: () => onRewarded?.(),
        onClose:    (wasShown) => onClose?.(wasShown),
        onError:    () => onClose?.(false),
      },
    });
  };

  const showBanner = async () => {
    const sdk = await _sdk();
    try { if (sdk) await sdk.adv.showBannerAdv(); } catch (_) {}
  };

  const hideBanner = async () => {
    const sdk = await _sdk();
    try { if (sdk) await sdk.adv.hideBannerAdv(); } catch (_) {}
  };

  return { showFullscreen, showRewarded, showBanner, hideBanner };
})();
