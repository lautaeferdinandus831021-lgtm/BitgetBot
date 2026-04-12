const { loadAll } = require('./loader');

const strategies = loadAll();

module.exports = {
    analyze: (price) => {
        console.log("📊 Analyze:", price.toFixed(2));

        const results = [];

        // single TF
        strategies.single.forEach(s => {
            if (s.analyze) {
                const res = s.analyze(price);
                if (res) results.push({ name: s.name, ...res });
            }
        });

        // dual TF
        strategies.dual.forEach(s => {
            if (s.analyze) {
                const res = s.analyze(price);
                if (res) results.push({ name: s.name, ...res });
            }
        });

        // multi TF
        strategies.multi.forEach(s => {
            if (s.analyze) {
                const res = s.analyze(price);
                if (res) results.push({ name: s.name, ...res });
            }
        });

        if (results.length > 0) {
            console.log("🚀 SIGNAL:", results);
        }
    }
};
