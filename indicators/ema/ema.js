export function EMA(data, period = 9) {
  const k = 2 / (period + 1)
  let ema = data[0]

  return data.map(price => {
    ema = price * k + ema * (1 - k)
    return ema
  })
}
