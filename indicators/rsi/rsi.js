export function RSI(data, period = 14) {
  let gains = 0
  let losses = 0

  for (let i = data.length - period; i < data.length - 1; i++) {
    const diff = data[i + 1] - data[i]
    if (diff >= 0) gains += diff
    else losses -= diff
  }

  const rs = gains / (losses || 1)
  return 100 - (100 / (1 + rs))
}
