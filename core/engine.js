const config = require('../config/userConfig');
const loader = require('./loader');
const { getPrice } = require('../modules/market/data');
const { execute } = require('./executor');

async function run() {
    const price = getPrice();

    console.log('📈 PRICE:', price.toFixed(2));

    // =====================
    // INDICATOR
    // =====================
    let indicatorResults = {};

    config.indicators.forEach(ind => {
        const fn = loader.indicator[ind];
        if (fn) {
            indicatorResults[ind] = fn(price);
        }
    });

    // =====================
    // STRATEGY
    // =====================
    const strategies = loader.strategy[config.strategyType];

    let signal = null;

    Object.values(strategies).forEach(strat => {
        const res = strat.run(price, indicatorResults);
        if (res && !signal) {
            signal = res;
        }
    });

    if (!signal) {
        console.log('⏳ No signal');
        return;
    }

    console.log('🚀 SIGNAL:', signal);

    // =====================
    // RISK MANAGEMENT
    // =====================
    const size = loader.risk.positionSize
        ? loader.risk.positionSize(config.risk.size)
        : config.risk.size;

    // =====================
    // EXECUTION (INI YANG KAMU MINTA)
    // =====================
    await execute({
        pair: config.pair,
        side: signal.toLowerCase(),
        size,
        type: config.orderType
    }, config.mode);
}

module.exports = { run };
