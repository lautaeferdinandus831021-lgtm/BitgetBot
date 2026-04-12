require('dotenv').config();

const { startPriceStream } = require('./market/price');
const strategy = require('./strategy/macd');
const { placeOrder, getBalance } = require('./exchange/execution');

const PAIR = 'BTCUSDT';

let prices = [];
let lastSignal = null;

console.log("🚀 BOT STARTED (REALTIME)");

startPriceStream(PAIR, async (price) => {
    try {

        prices.push(price);
        if (prices.length > 50) prices.shift();

        const signal = strategy(prices);

        console.log("PRICE:", price);
        console.log("SIGNAL:", signal);

        const balance = await getBalance();

        // MODE ANALISA
        if (balance < 100) {
            console.log("📊 ANALYSIS ONLY (saldo < 100)");
            return;
        }

        // EXECUTION
        if (signal && signal !== lastSignal) {
            lastSignal = signal;

            console.log("🚨 EXECUTE:", signal);

            await placeOrder({
                pair: PAIR,
                side: signal.toLowerCase(),
                size: 0.001
            });
        }

    } catch (err) {
        console.log("❌ ERROR:", err.message);
    }
});
