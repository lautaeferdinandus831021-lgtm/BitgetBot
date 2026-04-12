let buffer = []

export function build5m(candle1m) {
  buffer.push(candle1m)

  if (buffer.length === 5) {
    const open = buffer[0][1]
    const close = buffer[4][4]
    const high = Math.max(...buffer.map(c => c[2]))
    const low = Math.min(...buffer.map(c => c[3]))

    buffer = []

    return [Date.now(), open, high, low, close]
  }

  return null
}
