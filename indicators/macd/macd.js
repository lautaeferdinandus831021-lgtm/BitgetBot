function ema(values, period) {
  const k = 2 / (period + 1)
  let emaArr = [values[0]]

  for (let i = 1; i < values.length; i++) {
    emaArr.push(values[i] * k + emaArr[i - 1] * (1 - k))
  }

  return emaArr
}

function macd(values, fast = 4, slow = 5, signal = 1) {
  if (values.length < slow) return null

  const fastEMA = ema(values, fast)
  const slowEMA = ema(values, slow)

  const macdLine = fastEMA.map((v, i) => v - slowEMA[i])
  const signalLine = ema(macdLine, signal)

  const histogram = macdLine.map((v, i) => v - signalLine[i])

  return {
    macd: macdLine.at(-1),
    signal: signalLine.at(-1),
    hist: histogram.at(-1)
  }
}

module.exports = macd
