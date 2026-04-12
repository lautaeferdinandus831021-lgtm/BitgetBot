const m5 = []
const buffer = []

function pushFromM1(candle) {
  buffer.push(candle)

  if (buffer.length === 5) {
    const open = buffer[0].open
    const close = buffer[4].close
    const high = Math.max(...buffer.map(c => c.high))
    const low = Math.min(...buffer.map(c => c.low))

    m5.push({ open, high, low, close })

    buffer.length = 0

    if (m5.length > 100) {
      m5.shift()
    }
  }
}

function getCloses() {
  return m5.map(c => c.close)
}

module.exports = {
  pushFromM1,
  getCloses,
  data: m5
}
