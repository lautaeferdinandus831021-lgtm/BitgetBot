function calculateRisk(price, config) {
    const sl = price * (1 - config.risk.stopLoss / 100);
    const tp = price * (1 + config.risk.takeProfit / 100);

    return { sl, tp };
}

module.exports = { calculateRisk };
