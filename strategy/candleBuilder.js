let currentCandle = null;

function buildCandle(price) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);

  if (!currentCandle || currentCandle.minute !== minute) {
    // candle close
    const closed = currentCandle;

    // new candle
    currentCandle = {
      minute,
      open: price,
      high: price,
      low: price,
      close: price
    };

    return { closed, current: currentCandle };
  }

  // update candle
  currentCandle.high = Math.max(currentCandle.high, price);
  currentCandle.low = Math.min(currentCandle.low, price);
  currentCandle.close = price;

  return { closed: null, current: currentCandle };
}

module.exports = { buildCandle };
