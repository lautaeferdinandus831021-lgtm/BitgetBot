const spot = require('./spot/client');
const futures = require('./futures/client');

async function execute(order, mode = 'spot') {
    console.log('⚡ EXECUTE:', order, 'MODE:', mode);

    if (mode === 'spot') {
        return spot.placeOrder(order);
    }

    if (mode === 'futures') {
        return futures.placeOrder(order);
    }

    console.log('❌ Unknown mode:', mode);
}

module.exports = { execute };
