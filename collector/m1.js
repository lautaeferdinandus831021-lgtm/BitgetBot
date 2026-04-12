let m1 = []

export function pushM1(price) {
  m1.push(price)
  if (m1.length > 100) m1.shift()
}

export function getM1() {
  return m1
}
