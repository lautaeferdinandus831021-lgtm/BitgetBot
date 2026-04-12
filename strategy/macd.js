
// ===== EMA =====
function ema(data, period) {
    const k = 2 / (period + 1);
    let result = [data[0]];

    for (let i = 1; i < data.length; i++) {
        result.push(data[i] * k + result[i - 1] * (1 - k));
    }

    return result;
}

// ===== RSI =====
function rsi(prices, period) {
    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length - 1; i++) {
        let diff = prices[i + 1] - prices[i];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    if (losses === 0) return 100;

    const rs = gains / losses;
    return 100 - (100 / (1 + rs));
}

module.exports = function(prices) {
    if (prices.length < 30) return null;

    // ===== MACD FAST =====
    const ema4 = ema(prices, 4);
    const ema5 = ema(prices, 5);

    const macdLine = ema4.map((v, i) => v - ema5[i]);
    const signalLine = ema(macdLine, 3);

    const lastMACD = macdLine.at(-1);
    const lastSignal = signalLine.at(-1);
    const prevMACD = macdLine.at(-2);
    const prevSignal = signalLine.at(-2);

    // ===== RSI TRIPLE =====
    const rsi4 = rsi(prices, 4);
    const rsi5 = rsi(prices, 5);
    const rsi25 = rsi(prices, 25); // garis netral

    // ===== TREND EMA 5 =====
    const emaTrend = ema(prices, 5);
    const price = prices.at(-1);
    const trendUp = price > emaTrend.at(-1);
    const trendDown = price < emaTrend.at(-1);

    // ===== FILTER ZONE (hindari sideways) =====
    if (Math.abs(lastMACD - lastSignal) < 0.05) return null;

    // ===== BUY =====
    if (
        prevMACD < prevSignal &&
        lastMACD > lastSignal &&
        rsi4 > rsi5 &&
        rsi5 > rsi25 &&
        trendUp
    ) {
        return 'BUY';
    }

    // ===== SELL =====
    if (
        prevMACD > prevSignal &&
        lastMACD < lastSignal &&
        rsi4 < rsi5 &&
        rsi5 < rsi25 &&
        trendDown
    ) {
        return 'SELL';
    }

    return null;
};
