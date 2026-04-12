const MACD = require('./indicator').MACD;

let prices = [];
let lastSignal = null;
let confirmCount = 0;

function analyze(price) {
  prices.push(price);

  if (prices.length < 50) return null;

  const macdFast = MACD(prices, 2, 3, 1);
  const macdMid  = MACD(prices, 3, 4, 1);
  const macdSlow = MACD(prices, 4, 5, 1);

  const h1 = macdFast.histogram;
  const h2 = macdMid.histogram;
  const h3 = macdSlow.histogram;

  // ===== LOGIKA FILTER =====
  let currentSignal = null;

  if (h1 > 0 && h2 > 0 && h3 > 0) {
    currentSignal = 'BUY';
  }

  if (h1 < 0 && h2 < 0 && h3 < 0) {
    currentSignal = 'SELL';
  }

  // ===== DELAY 2 CANDLE CONFIRM =====
  if (currentSignal === lastSignal) {
    confirmCount++;
  } else {
    confirmCount = 1;
  }

  lastSignal = currentSignal;

  if (confirmCount >= 2) {
    confirmCount = 0;
    return currentSignal;
  }

  return null;
}

module.exports = { analyze };
