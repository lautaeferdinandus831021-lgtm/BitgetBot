require('dotenv').config();

const config = require('./config');
const getPrice = require('./ws/price');
const execute = require('./ws/execution');

// 🔥 pakai MACD strategy
const strategy = require('./strategy/macd');

let lastSignal = null;

async function run() {
    console.log("🚀 BOT STARTED (MACD MODE)");

    setInterval(async () => {
        try {
            const price = await getPrice(config.pair);

            if (!price) return;

            console.log("PRICE:", price);

            const signal = strategy(price);

            if (!signal) return;

            console.log("SIGNAL:", signal);

            // hindari spam order
            if (signal.signal === lastSignal) return;
            lastSignal = signal.signal;

            // cek saldo
            const balance = await execute.getBalance();

            if (balance < 100) {
                console.log("MODE ANALYSIS ONLY (saldo < 100)");
                return;
            }

            console.log("EXECUTE TRADE...");

            await execute.order({
                pair: config.pair,
                side: signal.signal === 'BUY' ? 'buy' : 'sell',
                size: 0.001,
                type: config.orderType || 'market'
            });

        } catch (err) {
            console.log("ERROR:", err.message);
        }
    }, 3000);
}

run();
