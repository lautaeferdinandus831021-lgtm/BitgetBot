const { getPrice } = require('../exchange/price');
const { getBalance } = require('../exchange/account');
const { placeOrder } = require('../exchange/order');

async function run() {
  const symbol = 'BTCUSDT';

  const price = await getPrice(symbol);
  if (!price) return;

  console.log('📊 PRICE:', price);

  const balanceData = await getBalance();
  if (!balanceData) return;

  const usdt = parseFloat(
    balanceData.data.find(a => a.coin === 'USDT')?.available || 0
  );

  console.log('💰 SALDO USDT:', usdt);

  // === MODE ANALISA ===
  if (usdt < 100) {
    console.log('🔍 MODE ANALISA (saldo < 100)');
    return;
  }

  // === AUTO TRADE ===
  console.log('🚀 AUTO TRADE AKTIF');

  const signal = Math.random() > 0.5 ? 'buy' : 'sell';

  console.log('📈 SIGNAL:', signal);

  const order = await placeOrder({
    symbol,
    side: signal,
    size: '0.001'
  });

  console.log('📦 ORDER RESULT:', order);
}

module.exports = { run };
