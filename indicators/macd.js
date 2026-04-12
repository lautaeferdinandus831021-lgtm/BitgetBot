let ema12 = null
let ema26 = null
let signal = null

const EMA = (prev, price, period) => {
  const k = 2 / (period + 1)
  return prev === null ? price : price * k + prev * (1 - k)
}

module.exports = (price) => {
  ema12 = EMA(ema12, price, 12)
  ema26 = EMA(ema26, price, 26)

  const macd = ema12 - ema26
  signal = EMA(signal, macd, 9)
  const hist = macd - signal

  return { macd, signal, hist }
}
