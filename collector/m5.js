let buffer = []
const candles = []

function buildM5(candleM1) {
  buffer.push(candleM1)

  if (buffer.length < 5) return candles

  const open = buffer[0].open
  const close = buffer[4].close
  const high = Math.max(...buffer.map(c => c.high))
  const low = Math.min(...buffer.map(c => c.low))

  candles.push({ open, high, low, close })

  if (candles.length > 200) candles.shift()

  buffer = []

  return candles
}

module.exports = { buildM5 }
