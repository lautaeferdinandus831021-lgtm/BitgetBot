function ema(data, period) {
  const k = 2 / (period + 1)
  let result = [data[0]]

  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k))
  }

  return result
}

function macd(data, fast = 4, slow = 5, signalPeriod = 1) {
  if (data.length < slow) return null

  const fastEMA = ema(data, fast)
  const slowEMA = ema(data, slow)

  const macdLine = fastEMA.map((v, i) => v - slowEMA[i])
  const signalLine = ema(macdLine, signalPeriod)

  return {
    hist: macdLine.at(-1) - signalLine.at(-1)
  }
}

module.exports = macd
