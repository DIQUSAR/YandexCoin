// Single source of truth for all runtime data.
// All mutations go through helpers below — never write state.* directly.
const state = {
  balance:    0,
  clickPower: 1,
};

const formatBalance = (thousandths) => {
  const int = Math.floor(thousandths / 1000);
  const dec = thousandths % 1000;
  return `${int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}.${dec.toString().padStart(3, '0')}`;
};

const addBalance = (amount) => { state.balance += amount; };
const setBalance = (value) => { state.balance = value; };
const setClickPower = (value) => { state.clickPower = value; };

const applyBoostOwned = (boost, count) => {
  boost.owned = count;
  if (boost.type === 'click') {
    setClickPower(1 + BOOSTS.filter(b => b.type === 'click').reduce((s, b) => s + b.owned * b.clickBonus, 0));
  }
};

const getBoostCost = (boost) => Math.round(boost.baseCost * Math.pow(boost.costMult, boost.owned));

const getTotalPerSec = () => BOOSTS.reduce((s, b) => s + b.owned * b.perSec, 0);
