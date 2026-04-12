const { EMA, RSI, MACD } = require('technicalindicators');

module.exports = function(prices) {

    if (prices.length < 30) return null;

    const macd = MACD.calculate({
        values: prices,
        fastPeriod: 4,
        slowPeriod: 5,
        signalPeriod: 3,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    });

    if (macd.length < 2) return null;

    const prev = macd[macd.length - 2];
    const curr = macd[macd.length - 1];

    const rsi4 = RSI.calculate({ values: prices, period: 4 }).pop();
    const rsi5 = RSI.calculate({ values: prices, period: 5 }).pop();
    const rsi25 = RSI.calculate({ values: prices, period: 25 }).pop();

    const ema5 = EMA.calculate({ values: prices, period: 5 });

    const trendUp = ema5[ema5.length - 1] > ema5[ema5.length - 2];

    // BUY
    if (
        prev.MACD < prev.signal &&
        curr.MACD > curr.signal &&
        rsi4 > rsi25 &&
        rsi5 > rsi25 &&
        trendUp
    ) {
        return "BUY";
    }

    // SELL
    if (
        prev.MACD > prev.signal &&
        curr.MACD < curr.signal &&
        rsi4 < rsi25 &&
        rsi5 < rsi25 &&
        !trendUp
    ) {
        return "SELL";
    }

    return null;
};
