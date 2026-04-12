const macd = require('../indicators/macd/macd')

function runDualTF(m1, m5) {
  if (m1.length < 10 || m5.length < 10) return

  const m1Close = m1.map(c => c.close)
  const m5Close = m5.map(c => c.close)

  const tf1 = macd(m1Close)
  const tf5 = macd(m5Close)

  if (!tf1 || !tf5) return

  // LOGIC:
  // M1 = akurasi entry
  // M5 = eksekusi

  if (tf1.hist > 0 && tf5.hist > 0) {
    console.log('🚀 BUY (M1 filter + M5 confirm)')
  }

  if (tf1.hist < 0 && tf5.hist < 0) {
    console.log('🔻 SELL (M1 filter + M5 confirm)')
  }
}

module.exports = runDualTF
