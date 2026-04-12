require('dotenv').config();

const getPrice = require('./ws/price');
const { placeOrder } = require('./ws/execution');
const strategy = require('./strategy/macd');

const PAIR = 'BTCUSDT';
const SIZE = 0.001;

let prices = [];

console.log("🚀 BOT STARTED (MACD MODE)");

setInterval(async () => {
    const price = await getPrice(PAIR);

    if (!price) return;

    console.log("PRICE:", price);

    // simpan data untuk MACD
    prices.push(price);
    if (prices.length > 50) prices.shift();

    // tunggu data cukup
    if (prices.length < 30) return;

    const signal = strategy(prices);

    console.log("SIGNAL:", signal);

    // cek saldo (simple logic)
    const balance = parseFloat(process.env.BALANCE || "0");

    if (balance < 100) {
        console.log("MODE ANALYSIS ONLY (saldo < 100)");
        return;
    }

    if (signal === 'BUY') {
        await placeOrder({
            pair: PAIR,
            side: 'buy',
            size: SIZE
        });
    }

    if (signal === 'SELL') {
        await placeOrder({
            pair: PAIR,
            side: 'sell',
            size: SIZE
        });
    }

}, 3000);
