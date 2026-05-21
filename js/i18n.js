const i18n = (() => {
  const DICT = {
    ru: {
      balance:     { label: 'Ваш счёт' },
      actions:     { rating: 'Рейтинг', boost: 'Ускорения', settings: 'Настройки' },
      boostBanner: { header: 'Автоматически', btnLabel: 'Получить ускорение' },
      clickBtn:    { label: 'tap', ariaLabel: 'Нажать для получения монет' },
      boostSheet:  { title: 'Ускорения', close: 'Закрыть', perSec: '/сек', perClick: '/клик', buy: 'Купить за', owned: 'куплено' },
      boost:       { cursor: 'Курсор', gpu: 'Видеокарта', gpuRack: 'Стойка видеокарт', superpc: 'Суперкомпьютер', server: 'Сервер' },
    },
    en: {
      balance:     { label: 'Your score' },
      actions:     { rating: 'Rating', boost: 'Boosts', settings: 'Settings' },
      boostBanner: { header: 'Auto', btnLabel: 'Get boost' },
      clickBtn:    { label: 'tap', ariaLabel: 'Tap to earn coins' },
      boostSheet:  { title: 'Boosts', close: 'Close', perSec: '/sec', perClick: '/click', buy: 'Buy for', owned: 'owned' },
      boost:       { cursor: 'Cursor', gpu: 'GPU', gpuRack: 'GPU Rack', superpc: 'Supercomputer', server: 'Server' },
    },
    tr: {
      balance:     { label: 'Puanınız' },
      actions:     { rating: 'Sıralama', boost: 'Güçlendirme', settings: 'Ayarlar' },
      boostBanner: { header: 'Otomatik', btnLabel: 'Güçlendirme al' },
      clickBtn:    { label: 'tap', ariaLabel: 'Jeton kazanmak için dokun' },
      boostSheet:  { title: 'Güçlendirmeler', close: 'Kapat', perSec: '/sn', perClick: '/tık', buy: 'Satın al', owned: 'sahip' },
      boost:       { cursor: 'İmleç', gpu: 'Ekran kartı', gpuRack: 'GPU Rafı', superpc: 'Süper bilgisayar', server: 'Sunucu' },
    },
    uz: {
      balance:     { label: 'Hisobingiz' },
      actions:     { rating: 'Reyting', boost: 'Kuchaytirish', settings: 'Sozlamalar' },
      boostBanner: { header: 'Avtomatik', btnLabel: 'Kuchaytirish olish' },
      clickBtn:    { label: 'tap', ariaLabel: 'Tanga olish uchun bosing' },
      boostSheet:  { title: 'Kuchaytirishlar', close: 'Yopish', perSec: '/sek', perClick: '/bosish', buy: 'Sotib olish', owned: 'sotib olingan' },
      boost:       { cursor: 'Kursor', gpu: 'Videokarta', gpuRack: 'GPU stendi', superpc: 'Superkompyuter', server: 'Server' },
    },
  };

  const FALLBACK = 'ru';
  let _lang   = FALLBACK;
  let _source = 'fallback';

  const _resolve = (obj, path) =>
    path.split('.').reduce((acc, key) => acc?.[key], obj) ?? null;

  const _detect = () => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang')?.slice(0, 2).toLowerCase();
      if (urlLang && DICT[urlLang]) return { lang: urlLang, source: 'url' };
    } catch (_) {}
    try {
      const saved = localStorage.getItem(LS_LANG);
      if (saved && DICT[saved]) return { lang: saved, source: 'storage' };
    } catch (_) {}
    try {
      const nav = navigator.language?.slice(0, 2).toLowerCase();
      if (nav && DICT[nav]) return { lang: nav, source: 'navigator' };
    } catch (_) {}
    return { lang: FALLBACK, source: 'fallback' };
  };

  const t = (path) =>
    _resolve(DICT[_lang], path) ?? _resolve(DICT[FALLBACK], path) ?? path;

  const getLang = () => _lang;

  const setLang = (lang) => {
    if (!DICT[lang]) return;
    _lang = lang;
    _source = 'manual';
    try { localStorage.setItem(LS_LANG, lang); } catch (_) {}
  };

  const initFromSDK = async () => {
    try {
      const sdk = await window.yandexSDKPromise;
      if (!sdk || _source === 'url' || _source === 'manual') return;
      const tag = sdk.environment?.i18n?.lang?.slice(0, 2).toLowerCase();
      if (tag && DICT[tag] && _lang !== tag) {
        _lang   = tag;
        _source = 'sdk';
        document.querySelectorAll('[data-i18n]').forEach(el => {
          el.textContent = t(el.getAttribute('data-i18n'));
        });
      }
    } catch (_) {}
  };

  const detected = _detect();
  _lang   = detected.lang;
  _source = detected.source;

  return { t, getLang, setLang, initFromSDK };
})();
