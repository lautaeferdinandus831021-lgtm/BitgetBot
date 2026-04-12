let data = []

module.exports = {
  add(c) {
    data.push(c)
    if (data.length > 200) data.shift()
  },
  get() {
    return data
  }
}
