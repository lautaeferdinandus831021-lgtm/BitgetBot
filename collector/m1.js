const m1 = []

function pushCandle(candle) {
  m1.push(candle)

  if (m1.length > 100) {
    m1.shift()
  }
}

function getCloses() {
  return m1.map(c => c.close)
}

module.exports = {
  pushCandle,
  getCloses,
  data: m1
}
