export function singleTFStrategy(price) {
  if (price > 70000) return "BUY"
  if (price < 69000) return "SELL"
  return null
}
