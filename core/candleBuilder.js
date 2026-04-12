let currentCandle = null;
let candles = [];

function buildCandle(price) {
  const now = Math.floor(Date.now() / 60000); // menit

  if (!currentCandle || currentCandle.time !== now) {
    if (currentCandle) candles.push(currentCandle);

    currentCandle = {
      time: now,
      open: price,
      high: price,
      low: price,
      close: price
    };

    return { closed: true, candle: currentCandle };
  }

  currentCandle.high = Math.max(currentCandle.high, price);
  currentCandle.low = Math.min(currentCandle.low, price);
  currentCandle.close = price;

  return { closed: false };
}

function getCandles() {
  return candles;
}

module.exports = { buildCandle, getCandles };
