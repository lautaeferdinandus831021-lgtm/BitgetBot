const runDualTF = require('./strategy/dualTF')
const { onM1Candle } = require('./collector/m1')
const { onM5Candle } = require('./collector/m5')

// SIMULASI DATA MASUK
setInterval(() => {
  const fakeM1 = { close: Math.random() * 100 }
  const fakeM5 = { close: Math.random() * 100 }

  const m1Data = onM1Candle(fakeM1)
  const m5Data = onM5Candle(fakeM5)

  runDualTF(m1Data, m5Data)
}, 1000)

console.log('🚀 BOT RUNNING DUAL TF...')
