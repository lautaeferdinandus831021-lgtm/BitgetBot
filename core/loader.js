const fs = require('fs');
const path = require('path');

function loadFolder(folder) {
    let modules = {};
    const dir = path.join(__dirname, '../modules', folder);

    if (!fs.existsSync(dir)) return modules;

    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.js')) {
            const name = file.replace('.js', '');
            modules[name] = require(path.join(dir, file));
            console.log('✅ Loaded', folder, name);
        }
    });

    return modules;
}

module.exports = {
    indicator: loadFolder('indicator'),
    risk: loadFolder('risk'),
    order: loadFolder('order'),

    strategy: {
        singleTF: loadFolder('strategy/singleTF'),
        dualTF: loadFolder('strategy/dualTF'),
        multiTF: loadFolder('strategy/multiTF')
    }
};
