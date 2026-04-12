const macd = require('../indicators/macd/macd')
const m1 = require('../collector/m1')
const m5 = require('../collector/m5')

function run() {
  const m1Closes = m1.getCloses()
  const m5Closes = m5.getCloses()

  if (m1Closes.length < 10 || m5Closes.length < 10) return

  const macdM1 = macd(m1Closes)
  const macdM5 = macd(m5Closes)

  if (!macdM1 || !macdM5) return

  // 🔥 LOGIC ENTRY
  if (macdM1.hist > 0 && macdM5.hist > 0) {
    console.log('🟢 BUY SIGNAL')
  }

  if (macdM1.hist < 0 && macdM5.hist < 0) {
    console.log('🔴 SELL SIGNAL')
  }
}

module.exports = run
