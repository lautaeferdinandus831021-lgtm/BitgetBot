let m5 = []

export function pushM5(price) {
  m5.push(price)
  if (m5.length > 100) m5.shift()
}

export function getM5() {
  return m5
}
