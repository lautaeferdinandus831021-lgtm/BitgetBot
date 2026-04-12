const { buildM1, getM1, getM5 } = require('./candleBuilder');

let closes = [];
let histArr = [];
let lastSignalTime = 0;

const COOLDOWN = 5 * 60 * 1000;

function ema(period, data) {
    const k = 2 / (period + 1);
    let ema = data[0];

    for (let i = 1; i < data.length; i++) {
        ema = data[i] * k + ema * (1 - k);
    }

    return ema;
}

function calcMACD() {
    if (closes.length < 30) return null;

    const ema12 = ema(12, closes);
    const ema26 = ema(26, closes);
    const macd = ema12 - ema26;

    const signal = ema(9, [...histArr, macd]);
    const hist = macd - signal;

    return hist;
}

function analyze(price) {
    const res = buildM1(price);

    if (!res.closed) return;

    const m1 = res.candle;
    closes.push(m1.close);

    if (closes.length > 100) closes.shift();

    const hist = calcMACD();
    if (!hist) return;

    histArr.push(hist);
    if (histArr.length > 50) histArr.shift();

    if (histArr.length < 5) return;

    const h1 = histArr.at(-1);
    const h2 = histArr.at(-2);
    const h3 = histArr.at(-3);

    const now = Date.now();

    const bullish =
        h3 < 0 &&
        h2 < 0 &&
        h1 > 0;

    const bearish =
        h3 > 0 &&
        h2 > 0 &&
        h1 < 0;

    if (now - lastSignalTime < COOLDOWN) {
        console.log("⏳ Cooldown...");
        return;
    }

    const m5 = getM5();

    console.log("🕯️ M1:", m1);
    console.log("📊 M5:", m5);

    if (bullish) {
        console.log("🚀 BUY SIGNAL (REAL MACD)");
        lastSignalTime = now;
    }

    if (bearish) {
        console.log("🔻 SELL SIGNAL (REAL MACD)");
        lastSignalTime = now;
    }
}

module.exports = { analyze };
