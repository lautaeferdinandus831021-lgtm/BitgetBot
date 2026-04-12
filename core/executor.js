const spot = require('../modules/exchange/spot/client');
const futures = require('../modules/exchange/futures/client');

function execute(order, mode) {
    console.log('⚡ EXECUTE:', order, 'MODE:', mode);

    if (mode === 'spot') {
        spot.placeOrder(order);
    } else if (mode === 'futures') {
        futures.placeOrder(order);
    } else {
        console.log('❌ Unknown mode');
    }
}

module.exports = { execute };
