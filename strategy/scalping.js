let lastPrice = null;

function analyze(price) {
    if (!lastPrice) {
        lastPrice = price;
        return null;
    }

    const diff = price - lastPrice;
    lastPrice = price;

    if (diff > 20) return 'buy';
    if (diff < -20) return 'sell';

    return null;
}

module.exports = { analyze };
