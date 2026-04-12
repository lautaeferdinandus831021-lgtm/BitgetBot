const { execute } = require('../modules/exchange');

async function run(order, mode, balance) {

    console.log('💰 BALANCE:', balance);

    // ❌ kalau saldo kecil → jangan trade
    if (balance < 100) {
        console.log('🧪 MODE ANALISA ONLY (Saldo < 100 USDT)');
        return;
    }

    console.log('🚀 REAL TRADE MODE');

    await execute(order, mode);
}

module.exports = { run };
