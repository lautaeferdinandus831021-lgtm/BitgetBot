function ema(data, period) {
  const k = 2 / (period + 1)
  let emaArray = [data[0]]

  for (let i = 1; i < data.length; i++) {
    emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k))
  }

  return emaArray
}

function macd(data, fast = 4, slow = 5, signalPeriod = 1) {
  if (data.length < slow) return null

  const emaFast = ema(data, fast)
  const emaSlow = ema(data, slow)

  const macdLine = emaFast.map((v, i) => v - emaSlow[i])
  const signalLine = ema(macdLine, signalPeriod)

  const hist = macdLine.map((v, i) => v - signalLine[i])

  return {
    macd: macdLine.at(-1),
    signal: signalLine.at(-1),
    hist: hist.at(-1)
  }
}

module.exports = macd
