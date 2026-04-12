const fs = require('fs');
const path = require('path');

function loadStrategies(dir) {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) return [];

    return fs.readdirSync(fullPath)
        .filter(f => f.endsWith('.js'))
        .map(f => require(path.join(fullPath, f)));
}

module.exports = {
    loadAll: () => ({
        single: loadStrategies('strategy/single_tf'),
        dual: loadStrategies('strategy/dual_tf'),
        multi: loadStrategies('strategy/multi_tf')
    })
};
