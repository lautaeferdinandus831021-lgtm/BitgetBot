let current5m = null

export function build5m(candle) {
  const time = parseInt(candle[0])
  const open = parseFloat(candle[1])
  const high = parseFloat(candle[2])
  const low = parseFloat(candle[3])
  const close = parseFloat(candle[4])

  // round ke 5 menit
  const bucket = Math.floor(time / 300000) * 300000

  // candle baru
  if (!current5m || current5m.time !== bucket) {
    const finished = current5m

    current5m = {
      time: bucket,
      open,
      high,
      low,
      close
    }

    return finished
  }

  // update candle berjalan
  current5m.high = Math.max(current5m.high, high)
  current5m.low = Math.min(current5m.low, low)
  current5m.close = close

  return null
}
