const { calcMACD } = require('../core/indicator');

function analyze(m1, m5) {
  if (!m1 || m1.length < 10) return null;

  const close = m1.map(c => c.close);

  // 🔥 2 MACD
  const macdFast = calcMACD(close, 2, 3, 1);
  const macdSlow = calcMACD(close, 3, 4, 1);

  const h1 = macdFast.histogram;
  const h2 = macdSlow.histogram;

  if (h1.length < 3 || h2.length < 3) return null;

  // ambil 3 candle terakhir
  const a1 = h1[h1.length - 3];
  const b1 = h1[h1.length - 2];
  const c1 = h1[h1.length - 1];

  const a2 = h2[h2.length - 3];
  const b2 = h2[h2.length - 2];
  const c2 = h2[h2.length - 1];

  console.log('📊 FAST:', a1, b1, c1);
  console.log('📊 SLOW:', a2, b2, c2);

  // 🔥 BUY LOGIC
  const buyCross =
    a1 < 0 && b1 < 0 && c1 > 0 &&   // cross up
    a2 < 0 && b2 < 0 && c2 > 0 &&   // confirm
    b1 > a1 && c1 > b1 &&           // momentum naik
    b2 > a2 && c2 > b2;

  // 🔥 SELL LOGIC
  const sellCross =
    a1 > 0 && b1 > 0 && c1 < 0 &&
    a2 > 0 && b2 > 0 && c2 < 0 &&
    b1 < a1 && c1 < b1 &&
    b2 < a2 && c2 < b2;

  if (buyCross) return 'buy';
  if (sellCross) return 'sell';

  return null;
}

module.exports = { analyze };
