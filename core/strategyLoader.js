const fs = require('fs');
const path = require('path');

function loadStrategies() {
    const basePath = path.join(__dirname, '../strategy');
    let strategies = [];

    function scan(dir) {
        const files = fs.readdirSync(dir);

        for (let file of files) {
            const fullPath = path.join(dir, file);

            if (fs.statSync(fullPath).isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith('.js')) {
                try {
                    const strat = require(fullPath);
                    strategies.push(strat);
                    console.log('✅ Loaded strategy:', file);
                } catch (err) {
                    console.log('❌ Failed load:', file);
                }
            }
        }
    }

    scan(basePath);

    return strategies;
}

module.exports = { loadStrategies };
