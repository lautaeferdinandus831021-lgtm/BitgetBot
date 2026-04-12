const { getPrice, getBalance, placeOrder } = require('../exchange/bitget');

module.exports = async function () {
  const symbol = 'BTCUSDT';

  const price = await getPrice(symbol);
  if (!price) return [];

  console.log('PRICE:', price);

  const balances = await getBalance();

  let usdt = 0;
  balances.forEach(b => {
    if (b.coin === 'USDT') usdt = parseFloat(b.available);
  });

  console.log('USDT BALANCE:', usdt);

  // MODE ANALISA
  if (usdt < 100) {
    console.log('MODE: ANALYSIS ONLY');
    return [
      {
        name: 'scalp',
        signal: price % 2 === 0 ? 'BUY' : 'SELL',
      },
    ];
  }

  // MODE AUTO TRADE
  console.log('MODE: AUTO TRADE');

  const side = price % 2 === 0 ? 'buy' : 'sell';

  await placeOrder(symbol, side, 0.001);

  return [
    {
      name: 'scalp-auto',
      signal: side.toUpperCase(),
    },
  ];
};
