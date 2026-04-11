class CandleBuilder {
  constructor() {
    this.m1 = [];
    this.current = null;
  }

  update(price) {
    const now = Date.now();
    const minute = Math.floor(now / 60000);

    // candle baru
    if (!this.current || this.current.minute !== minute) {
      if (this.current) {
        this.m1.push(this.current.close);
      }

      this.current = {
        minute,
        open: price,
        high: price,
        low: price,
        close: price
      };

      return { newCandle: true };
    }

    // update candle berjalan
    this.current.high = Math.max(this.current.high, price);
    this.current.low = Math.min(this.current.low, price);
    this.current.close = price;

    return { newCandle: false };
  }

  getM1() {
    return [...this.m1];
  }

  // 🔥 M5 ROLLING
  getM5Rolling() {
    const m1 = this.getM1();
    const m5 = [];

    for (let i = 4; i < m1.length; i++) {
      const slice = m1.slice(i - 4, i + 1);
      m5.push(slice[4]); // close terakhir
    }

    return m5;
  }
}

module.exports = new CandleBuilder();
