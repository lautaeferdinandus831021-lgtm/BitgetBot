const fs = require('fs');
const path = require('path');

function loadStrategies(folder) {
    const fullPath = path.join(__dirname, folder);

    if (!fs.existsSync(fullPath)) return [];

    return fs.readdirSync(fullPath)
        .filter(f => f.endsWith('.js'))
        .map(f => {
            const mod = require(path.join(fullPath, f));
            return {
                name: f.replace('.js', ''),
                ...mod
            };
        });
}

module.exports = {
    loadAll: () => ({
        single: loadStrategies('single_tf'),
        dual: loadStrategies('dual_tf'),
        multi: loadStrategies('multi_tf')
    })
};
