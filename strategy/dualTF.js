const macd = require('../indicators/macd/macd')

function runDualTF(m1Candles, m5Candles) {
  if (m1Candles.length < 10 || m5Candles.length < 10) return

  const m1Close = m1Candles.map(c => c.close)
  const m5Close = m5Candles.map(c => c.close)

  const m1Macd = macd(m1Close)
  const m5Macd = macd(m5Close)

  if (!m1Macd || !m5Macd) return

  // LOGIC:
  // M1 = filter entry
  // M5 = confirm eksekusi

  if (m1Macd.hist > 0 && m5Macd.hist > 0) {
    console.log('🔥 BUY SIGNAL (M1 + M5 CONFIRM)')
  }

  if (m1Macd.hist < 0 && m5Macd.hist < 0) {
    console.log('❄️ SELL SIGNAL (M1 + M5 CONFIRM)')
  }
}

module.exports = runDualTF
