function calcSize(balance, price) {
    const risk = balance * 0.1; // 10%
    return (risk / price).toFixed(4);
}

module.exports = { calcSize };
