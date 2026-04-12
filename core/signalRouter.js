const { loadStrategies } = require('./strategyLoader');

const strategies = loadStrategies();

function analyze(price) {
    let signals = [];

    strategies.forEach((strat) => {
        try {
            if (!strat.run) return;

            const result = strat.run(price);

            if (result) {
                signals.push({
                    name: strat.name || 'unknown',
                    signal: result
                });
            }
        } catch (err) {
            console.log('❌ Error strategy:', strat.name || 'unknown');
        }
    });

    if (signals.length > 0) {
        console.log('🚀 SIGNAL:', signals);
    }
}

module.exports = { analyze };
