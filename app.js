import { startWS } from './ws/bitgetWs.js'
import { build5m } from './utils/candleBuilder.js'
import { CONFIG } from './config/env.js'

import { singleTFStrategy } from './strategy/singleTF.js'
import { dualTFStrategy, updateTrend } from './strategy/dualTF.js'

let history1m = []
let history5m = []

console.log("🚀 BOT STARTED MODE:", CONFIG.MODE)

startWS((candle) => {

  const price = parseFloat(candle[4])

  history1m.push(price)
  if (history1m.length > 100) history1m.shift()

  console.log("📈 1M PRICE:", price)

  if (CONFIG.MODE === "SINGLE") {
    const signal = singleTFStrategy(price)
    console.log("SIGNAL:", signal)
  }

  if (CONFIG.MODE === "DUAL") {
    updateTrend(price, history1m)

    const candle5m = build5m(candle)

    if (candle5m) {
      const price5m = parseFloat(candle5m[4])

      history5m.push(price5m)
      if (history5m.length > 100) history5m.shift()

      console.log("🕯️ 5M PRICE:", price5m)

      const signal = dualTFStrategy(price5m, history5m)

      console.log("🔥 SIGNAL:", signal)
    }
  }
})
