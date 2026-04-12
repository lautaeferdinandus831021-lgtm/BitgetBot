const fs = require('fs');
const path = require('path');

function loadStrategies() {
    const strategies = [];
    const baseDir = path.join(__dirname, '../strategy');

    function scan(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);

            if (fs.statSync(fullPath).isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith('.js')) {
                try {
                    console.log('📂 Scanning:', fullPath);

                    const strat = require(fullPath);

                    if (!strat || typeof strat.run !== 'function') {
                        console.log('⚠️ Skip invalid:', file);
                        continue;
                    }

                    console.log('✅ Loaded strategy:', strat.name || file);

                    strategies.push(strat);

                } catch (err) {
                    console.log('❌ Failed load:', file);
                    console.log('   ↳', err.message);
                }
            }
        }
    }

    scan(baseDir);

    return strategies;
}

module.exports = { loadStrategies };
