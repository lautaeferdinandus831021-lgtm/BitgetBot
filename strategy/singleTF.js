export function singleTFStrategy(price) {
  if (!price) return "WAIT"

  if (price % 2 === 0) return "BUY"
  return "SELL"
}
