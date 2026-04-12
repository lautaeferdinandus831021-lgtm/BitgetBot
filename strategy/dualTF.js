import { macd } from '../indicators/macd/macd.js'

export function dualTFStrategy(m1, m5) {
  const tf1 = macd(m1)
  const tf5 = macd(m5)

  if (!tf1 || !tf5) return "WAIT"

  console.log("M1:", tf1)
  console.log("M5:", tf5)

  if (tf1.hist > 0 && tf5.hist > 0 && tf5.macd > tf5.signal) {
    return "BUY"
  }

  if (tf1.hist < 0 && tf5.hist < 0 && tf5.macd < tf5.signal) {
    return "SELL"
  }

  return "WAIT"
}
