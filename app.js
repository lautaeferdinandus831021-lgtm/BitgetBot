const { analyze } = require('./core/signalRouter');
const { getPrice } = require('./market/data');
const { execute } = require('./core/executor');
const { loadConfig } = require('./core/configLoader');
const { calculateRisk } = require('./risk/riskManager');

const config = loadConfig();

setInterval(() => {
    const price = getPrice();

    console.log('📊 PRICE:', price);

    const signals = analyze(price);

    if (!signals.length) return;

    const signal = signals[0];

    console.log('📢 SIGNAL:', signal);

    const { sl, tp } = calculateRisk(price, config);

    execute({
        pair: config.pair,
        side: signal.signal === 'BUY' ? 'buy' : 'sell',
        size: config.size,
        type: config.orderType,
        stopLoss: sl,
        takeProfit: tp
    }, config.mode);

}, 2000);
