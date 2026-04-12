function buildM5(m1Candles) {
  if (m1Candles.length < 5) return null;

  const last5 = m1Candles.slice(-5);

  return {
    time: last5[4].time,
    open: last5[0].open,
    high: Math.max(...last5.map(c => c.high)),
    low: Math.min(...last5.map(c => c.low)),
    close: last5[4].close
  };
}

module.exports = { buildM5 };
