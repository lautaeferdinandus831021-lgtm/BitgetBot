const { EMA } = require('technicalindicators');

let prices = [];

function calculateMACD() {
    if (prices.length < 50) return null;

    const ema12 = EMA.calculate({ period: 12, values: prices });
    const ema26 = EMA.calculate({ period: 26, values: prices });

    const macdLine = ema12.slice(-ema26.length).map((v, i) => v - ema26[i]);
    const signalLine = EMA.calculate({ period: 9, values: macdLine });

    const hist = macdLine.slice(-signalLine.length).map((v, i) => v - signalLine[i]);

    return {
        macd: macdLine.slice(-1)[0],
        signal: signalLine.slice(-1)[0],
        hist: hist.slice(-1)[0],
        prevHist: hist.slice(-2)[0]
    };
}

module.exports = (price) => {
    prices.push(price);
    if (prices.length > 200) prices.shift();

    const data = calculateMACD();
    if (!data) return null;

    console.log("MACD:", data);

    // BUY
    if (data.hist > 0 && data.prevHist < 0) {
        return { name: 'macd', signal: 'BUY' };
    }

    // SELL
    if (data.hist < 0 && data.prevHist > 0) {
        return { name: 'macd', signal: 'SELL' };
    }

    return null;
};
