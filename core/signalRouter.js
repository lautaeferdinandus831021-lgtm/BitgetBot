const { loadAll } = require('./loader');

const strategies = loadAll();

module.exports = {
    analyze: (price) => {
        const results = [];

        Object.values(strategies).flat().forEach(s => {
            const res = s.analyze(price);
            if (res) results.push(res);
        });

        if (results.length) {
            console.log("🚀 SIGNAL:", results);
        } else {
            console.log("⏳ No signal");
        }
    }
};
