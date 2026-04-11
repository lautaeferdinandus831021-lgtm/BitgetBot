require('dotenv').config();

const { getBalance, placeOrder } = require('./core/api');
const { getPrice } = require('./ws/price');
const config = require('./config');

let lastPrice = 0;

async function start() {
  console.log('🚀 Starting Bot:', config.SYMBOL);

  const balance = await getBalance();
  console.log('💰 Balance:', balance);

  // ✅ RULE: NO TRADE IF NO BALANCE
  if (config.RULES.ANALYZE_ONLY_IF_NO_BALANCE && (!balance || balance <= 0)) {
    console.log('⚠️ MODE ANALISA (NO TRADE)');

    setInterval(() => {
      const price = getPrice();
      if (!price) return;

      console.log('📊', config.SYMBOL, 'PRICE:', price);

      if (lastPrice === 0) {
        lastPrice = price;
        return;
      }

      if (price > lastPrice) {
        console.log('📈 SIGNAL: BUY');
      } else if (price < lastPrice) {
        console.log('📉 SIGNAL: SELL');
      }

      lastPrice = price;

    }, 3000);

    return;
  }

  console.log('✅ MODE TRADING');

  setTimeout(() => {
    placeOrder('buy');
  }, 5000);
}

start();
