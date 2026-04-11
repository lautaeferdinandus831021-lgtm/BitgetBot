let current = null;

function buildCandle(price) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);

  if (!current) {
    current = {
      minute,
      open: price,
      high: price,
      low: price,
      close: price
    };
    return { closed: null };
  }

  if (minute !== current.minute) {
    const closed = { ...current };

    current = {
      minute,
      open: price,
      high: price,
      low: price,
      close: price
    };

    return { closed };
  }

  current.high = Math.max(current.high, price);
  current.low = Math.min(current.low, price);
  current.close = price;

  return { closed: null };
}

module.exports = { buildCandle };
