let m1 = [];
let current = null;

function build(price) {
    const now = Date.now();
    const minute = Math.floor(now / 60000);

    if (!current || current.minute !== minute) {
        if (current) {
            m1.push(current);
            if (m1.length > 200) m1.shift();
        }

        current = {
            minute,
            open: price,
            high: price,
            low: price,
            close: price
        };

        return { closed: true, candle: current };
    }

    current.high = Math.max(current.high, price);
    current.low = Math.min(current.low, price);
    current.close = price;

    return { closed: false };
}

function getM1() {
    return m1;
}

function getM5() {
    if (m1.length < 5) return null;

    const last = m1.slice(-5);

    return {
        open: last[0].open,
        high: Math.max(...last.map(c => c.high)),
        low: Math.min(...last.map(c => c.low)),
        close: last.at(-1).close
    };
}

module.exports = { build, getM1, getM5 };
