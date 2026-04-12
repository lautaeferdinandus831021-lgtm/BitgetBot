const { getPrice } = require('./market/data');
const { getBalance } = require('./modules/exchange/account');
const { run } = require('./core/executor');
const { analyze } = require('./strategy/scalping');
const { calcSize } = require('./utils/size');

const config = {
    pair: 'BTCUSDT',
    mode: 'spot'
};

async function start() {

    setInterval(async () => {

        const price = await getPrice(config.pair);
        if (!price) return;

        console.log('📈 PRICE:', price);

        const signal = analyze(price);
        if (!signal) return;

        console.log('📊 SIGNAL:', signal);

        const balance = await getBalance();

        const size = calcSize(balance, price);

        const order = {
            pair: config.pair,
            side: signal,
            size: size,
            type: 'market'
        };

        await run(order, config.mode, balance);

    }, 3000);
}

start();
