const { getPrice } = require('../exchange/market');
const { placeOrder } = require('../exchange/execution');

async function runStrategy() {
  const price = await getPrice();

  if (!price) return;

  console.log('PRICE:', price);

  // simple scalping logic
  const signal = Math.random() > 0.5 ? 'buy' : 'sell';

  console.log('SIGNAL:', signal);

  const balance = parseFloat(process.env.BALANCE || 0);

  if (balance < 100) {
    console.log('MODE ANALYSIS ONLY (saldo < 100)');
    return;
  }

  console.log('AUTO TRADE ACTIVE 🚀');

  await placeOrder({
    symbol: 'BTCUSDT',
    side: signal,
    size: '0.001'
  });
}

module.exports = { runStrategy };
