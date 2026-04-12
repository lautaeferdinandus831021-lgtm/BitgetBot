import { EMA, RSI } from '../indicators/index.js'

let trend = null

export function updateTrend(price1m, history) {
  const ema = EMA(history, 9).slice(-1)[0]

  if (price1m > ema) trend = "UP"
  else trend = "DOWN"
}

export function dualTFStrategy(price5m, history) {
  const rsi = RSI(history, 14)

  if (trend === "UP" && rsi > 50) return "BUY"
  if (trend === "DOWN" && rsi < 50) return "SELL"

  return null
}
