const applyI18n = () => {
  document.documentElement.lang = i18n.getLang();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18n.t(el.getAttribute('data-i18n'));
  });
};

applyI18n();
Odometer.update(state.balance, false);
GameReady.init();

(async () => {
  await i18n.initFromSDK();
  applyI18n();

  await YandexSync.init(() => {
    BoostSheet.refresh();
    BoostSheet.startTick();
  });
})();
