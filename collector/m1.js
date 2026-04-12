const candles = []

function pushM1(candle) {
  candles.push(candle)
  if (candles.length > 200) candles.shift()
  return candles
}

module.exports = { pushM1 }
