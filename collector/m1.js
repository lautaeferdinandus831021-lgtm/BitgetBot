const candles = []

function onM1Candle(candle) {
  candles.push(candle)

  if (candles.length > 100) candles.shift()

  return candles
}

module.exports = {
  onM1Candle
}
