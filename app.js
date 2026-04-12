const { analyze } = require('./logic/signalRouter');

// contoh test stream price
setInterval(() => {
    const price = Math.random() * 100000;
    console.log("📈 PRICE:", price.toFixed(2));
    analyze(price);
}, 2000);
