let candles = []
let current = null

module.exports = (price) => {
  const time = Math.floor(Date.now() / 60000) * 60

  if (!current || current.time !== time) {
    if (current) candles.push(current)

    current = {
      time,
      open: price,
      high: price,
      low: price,
      close: price
    }
  } else {
    current.high = Math.max(current.high, price)
    current.low = Math.min(current.low, price)
    current.close = price
  }

  return current
}
