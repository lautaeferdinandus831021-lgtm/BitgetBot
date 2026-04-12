const { getPrice } = require('./market/data');
const { run } = require('./core/executor');
const config = require('./config');

async function start() {
    setInterval(async () => {

        const price = await getPrice(config.pair);

        if (!price) return;

        console.log('📈 PRICE:', price);

        // dummy signal
        const signal = price % 2 === 0 ? 'buy' : 'sell';

        const order = {
            pair: config.pair,
            side: signal,
            size: 0.001,
            type: 'market'
        };

        await run(order, config.mode);

    }, 3000);
}

start();
