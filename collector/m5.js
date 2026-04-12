const candles = []

function onM5Candle(candle) {
  candles.push(candle)

  if (candles.length > 100) candles.shift()

  return candles
}

module.exports = {
  onM5Candle
}
