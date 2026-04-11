let closes = [];

let prevMacd = null;
let prevSignal = null;

function ema(period, data) {
  const k = 2 / (period + 1);
  let ema = data[0];

  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }

  return ema;
}

function stddev(data) {
  const mean = data.reduce((a, b) => a + b) / data.length;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

function analyze(price) {
  closes.push(price);

  // butuh data cukup
  if (closes.length < 10) return null;

  const data = closes.slice(-10);

  // 🔹 MACD (4,5,1)
  const emaFast = ema(4, data);
  const emaSlow = ema(5, data);
  const macd = emaFast - emaSlow;
  const signal = macd; // signal=1 (instant)

  // 🔹 Bollinger (5, dev 2)
  const sma = data.reduce((a, b) => a + b) / data.length;
  const sd = stddev(data);

  const upper = sma + 2 * sd;
  const lower = sma - 2 * sd;

  let result = null;

  if (prevMacd !== null && prevSignal !== null) {
    // CROSS UP + BB bawah
    if (prevMacd < prevSignal && macd > signal && price < lower) {
      result = 'buy';
    }

    // CROSS DOWN + BB atas
    if (prevMacd > prevSignal && macd < signal && price > upper) {
      result = 'sell';
    }
  }

  prevMacd = macd;
  prevSignal = signal;

  return result;
}

module.exports = { analyze };
