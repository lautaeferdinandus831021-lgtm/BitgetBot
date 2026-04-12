const { loadStrategies } = require('./strategyLoader');

const strategies = loadStrategies();

function analyze(price) {
    const signals = [];

    for (const strat of strategies) {
        try {
            const result = strat.run(price);

            if (result) {
                signals.push({
                    name: strat.name,
                    signal: result
                });
            }
        } catch (err) {
            console.log('⚠️ Error strategy:', strat.name);
        }
    }

    if (signals.length > 0) {
        console.log('🚀 SIGNAL:', signals);
    }

    return signals;
}

module.exports = { analyze };
