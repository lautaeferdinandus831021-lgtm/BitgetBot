let trend = null

export function updateTrend(price, history1m) {
  if (history1m.length < 10) return

  const avg =
    history1m.slice(-10).reduce((a, b) => a + b, 0) / 10

  trend = price > avg ? "UP" : "DOWN"

  console.log("📊 TREND:", trend)
}

export function dualTFStrategy(price5m, history5m) {
  if (!trend) return "WAIT"

  if (trend === "UP") return "BUY"
  if (trend === "DOWN") return "SELL"

  return "WAIT"
}
