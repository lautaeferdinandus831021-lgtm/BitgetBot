let m1 = [];
let currentCandle = null;

function buildM1(price) {
    const now = Date.now();
    const minute = Math.floor(now / 60000);

    if (!currentCandle || currentCandle.minute !== minute) {
        if (currentCandle) {
            m1.push(currentCandle);
            if (m1.length > 100) m1.shift();
        }

        currentCandle = {
            minute,
            open: price,
            high: price,
            low: price,
            close: price
        };

        return { closed: true, candle: currentCandle };
    }

    currentCandle.high = Math.max(currentCandle.high, price);
    currentCandle.low = Math.min(currentCandle.low, price);
    currentCandle.close = price;

    return { closed: false };
}

function getM1() {
    return m1;
}

function getM5() {
    if (m1.length < 5) return null;

    const last5 = m1.slice(-5);

    return {
        open: last5[0].open,
        high: Math.max(...last5.map(c => c.high)),
        low: Math.min(...last5.map(c => c.low)),
        close: last5[last5.length - 1].close
    };
}

module.exports = { buildM1, getM1, getM5 };
