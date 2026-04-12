let histArr = [];

let lastSignalTime = 0;
const COOLDOWN_MS = 5 * 60 * 1000; // min 5 menit

function analyze(price) {
    // simulasi histogram (ganti nanti dengan real MACD)
    const hist = Math.sin(Date.now() / 10000); 

    histArr.push(hist);
    if (histArr.length > 10) histArr.shift();

    if (histArr.length < 5) return;

    const h1 = histArr[histArr.length - 1];
    const h2 = histArr[histArr.length - 2];
    const h3 = histArr[histArr.length - 3];
    const h4 = histArr[histArr.length - 4];

    const now = Date.now();

    // ===== LOGIC CROSS =====
    const bullishCross =
        h3 < 0 &&
        h2 < 0 &&
        h1 > 0 &&
        h2 > h3; // momentum naik

    const bearishCross =
        h3 > 0 &&
        h2 > 0 &&
        h1 < 0 &&
        h2 < h3; // momentum turun

    // ===== COOLDOWN FILTER =====
    if (now - lastSignalTime < COOLDOWN_MS) {
        console.log("⏳ Cooldown aktif...");
        return;
    }

    // ===== SIGNAL =====
    if (bullishCross) {
        console.log("🚀 BUY SIGNAL (MACD 2 candle confirm)");
        lastSignalTime = now;
    }

    if (bearishCross) {
        console.log("🔻 SELL SIGNAL (MACD 2 candle confirm)");
        lastSignalTime = now;
    }
}

module.exports = { analyze };
