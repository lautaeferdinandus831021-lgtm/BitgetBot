import { startWS } from './ws/bitgetWs.js'
import { pushM1, getM1 } from './collector/m1.js'
import { pushM5, getM5 } from './collector/m5.js'
import { dualTFStrategy } from './strategy/dualTF.js'

console.log("🚀 BOT STARTED: DUAL TF (M1 + M5)")

startWS(

  // M1
  (candle) => {
    const price = parseFloat(candle[4])
    if (!price) return

    pushM1(price)

    console.log("📈 M1:", price)
  },

  // M5
  (candle) => {
    const price = parseFloat(candle[4])
    if (!price) return

    pushM5(price)

    console.log("🕯️ M5:", price)

    const signal = dualTFStrategy(getM1(), getM5())

    console.log("🔥 SIGNAL:", signal)
  }

)
