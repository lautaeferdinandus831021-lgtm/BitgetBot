const { execute } = require('../modules/exchange');

async function run(order, mode) {
    console.log('📤 SEND ORDER:', order);
    await execute(order, mode);
}

module.exports = { run };
