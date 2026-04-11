const builder = require('../core/candleBuilder');

// EMA
function ema(data, period) {
  let k = 2 / (period + 1);
  let emaArr = [data[0]];
  for (let i = 1; i < data.length; i++) {
    emaArr.push(data[i] * k + emaArr[i - 1] * (1 - k));
  }
  return emaArr;
}

// MACD
function macd(data, fast, slow, signalPeriod) {
  const emaFast = ema(data, fast);
  const emaSlow = ema(data, slow);
  const macdLine = emaFast.map((v, i) => v - emaSlow[i]);
  const signalLine = ema(macdLine, signalPeriod);

  const last = macdLine.length - 1;

  return {
    bullish: macdLine[last] > signalLine[last],
    bearish: macdLine[last] < signalLine[last]
  };
}

// BB
function bollinger(data, period = 5, dev = 2) {
  const slice = data.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
  const std = Math.sqrt(variance);

  return {
    upper: mean + dev * std,
    middle: mean,
    lower: mean - dev * std
  };
}

// 🔥 NO REPAINT ANALYZE
function analyze(price, isNewCandle) {
  // update builder
  const res = builder.update(price);

  // 🚫 hanya eksekusi saat candle M1 close
  if (!res.newCandle) return null;

  const m1 = builder.getM1();
  const m5 = builder.getM5Rolling();

  if (m1.length < 10 || m5.length < 5) return null;

  const macdM1 = macd(m1, 4, 5, 1);

  const m5a = macd(m5, 2, 3, 1);
  const m5b = macd(m5, 3, 4, 1);
  const m5c = macd(m5, 4, 5, 1);

  const m5Bull = [m5a, m5b, m5c].filter(x => x.bullish).length;
  const m5Bear = [m5a, m5b, m5c].filter(x => x.bearish).length;

  const bb = bollinger(m1, 5, 2);

  const lastPrice = m1[m1.length - 1];

  console.log('📊 CLOSE M1:', lastPrice);

  // ===== SIGNAL FIX (NO REPAINT) =====
  if (macdM1.bullish && m5Bull >= 1 && lastPrice <= bb.middle) {
    console.log('✅ FIX SIGNAL BUY');
    return 'buy';
  }

  if (macdM1.bearish && m5Bear >= 1 && lastPrice >= bb.middle) {
    console.log('❌ FIX SIGNAL SELL');
    return 'sell';
  }

  console.log('⏸️ NO SIGNAL');
  return null;
}

module.exports = { analyze };
