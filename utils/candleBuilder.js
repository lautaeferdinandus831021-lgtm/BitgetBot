let buffer = []

export function build5m(candle) {
  buffer.push(candle)

  if (buffer.length < 5) return null

  const open = parseFloat(buffer[0][1])
  const close = parseFloat(buffer[4][4])
  const high = Math.max(...buffer.map(c => parseFloat(c[2])))
  const low = Math.min(...buffer.map(c => parseFloat(c[3])))

  const result = [Date.now(), open, high, low, close]

  buffer = [] // reset

  return result
}
