const { analyze } = require('./core/signalRouter');
const { getPrice } = require('./market/data');

setInterval(() => {
    const price = getPrice();
    console.log("📈 PRICE:", price.toFixed(2));
    analyze(price);
}, 2000);
