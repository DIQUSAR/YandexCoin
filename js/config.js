// ⚠️ DIGIT_H must match CSS --digit-h
const DIGIT_H       = 52;
const REEL_DELAY_MS = 38;
const MIN_PRESS_MS  = 140;

const AUDIO_SRC    = 'AUDIO/numbers.mp3';
const AUDIO_VOLUME = 0.25;

const CLOUD_KEY  = 'yandexcoin_save_v1';
const LS_KEY     = 'yc_save';
const LS_LANG    = 'yc_lang';
const SAVE_DELAY = 3000;

const FULLSCREEN_AD_COOLDOWN = 60_000;

const BOOSTS = [
  { id: 'cursor',  type: 'click',   icon: '🖱️', clickBonus: 1,  perSec: 0,   baseCost: 195,   costMult: 1.5, owned: 0 },
  { id: 'gpu',     type: 'passive', icon: '🎮', clickBonus: 0,  perSec: 3,   baseCost: 286,   costMult: 1.5, owned: 0 },
  { id: 'gpuRack', type: 'passive', icon: '🖥️', clickBonus: 0,  perSec: 10,  baseCost: 1300,  costMult: 1.5, owned: 0 },
  { id: 'superpc', type: 'passive', icon: '💻', clickBonus: 0,  perSec: 30,  baseCost: 10000, costMult: 1.5, owned: 0 },
  { id: 'server',  type: 'passive', icon: '🗄️', clickBonus: 0,  perSec: 100, baseCost: 50000, costMult: 1.5, owned: 0 },
];
