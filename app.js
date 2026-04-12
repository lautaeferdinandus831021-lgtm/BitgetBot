const { pushM1 } = require('./collector/m1')
const { buildM5 } = require('./collector/m5')
const runDualTF = require('./strategy/dualTF')

console.log('🚀 BOT STARTED (DUAL TF)')

setInterval(() => {
  // simulasi candle M1
  const candle = {
    open: Math.random() * 100,
    high: Math.random() * 100,
    low: Math.random() * 100,
    close: Math.random() * 100
  }

  const m1 = pushM1(candle)
  const m5 = buildM5(candle)

  runDualTF(m1, m5)
}, 1000)
