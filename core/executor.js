const spot = require('../modules/exchange/spot/client');
const futures = require('../modules/exchange/futures/client');

async function execute(order, mode) {
    if (mode === 'spot') {
        return spot.placeOrder(order);
    } else if (mode === 'futures') {
        return futures.placeOrder(order);
    } else {
        console.log('❌ Unknown mode:', mode);
    }
}

module.exports = { execute };
