let buffer = []

module.exports = (candle) => {
  if (!candle) return null

  buffer.push(candle)

  if (buffer.length < 5) return null

  const m5 = {
    time: buffer[0].time,
    open: buffer[0].open,
    high: Math.max(...buffer.map(c => c.high)),
    low: Math.min(...buffer.map(c => c.low)),
    close: buffer[buffer.length - 1].close
  }

  buffer = []
  return m5
}
