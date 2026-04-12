function EMA(values, period) {
  const k = 2 / (period + 1);
  let ema = values[0];

  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k);
  }

  return ema;
}

function MACD(values, fast, slow, signal) {
  const fastEMA = EMA(values.slice(-fast * 3), fast);
  const slowEMA = EMA(values.slice(-slow * 3), slow);

  const macd = fastEMA - slowEMA;

  const signalLine = macd; // ultra fast (signal=1)

  return {
    macd,
    signal: signalLine,
    histogram: macd - signalLine
  };
}

module.exports = { MACD };
