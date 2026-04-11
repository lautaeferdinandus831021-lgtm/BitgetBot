require('dotenv').config();

const { getBalance, placeOrder } = require('./core/api');
const { getPrice } = require('./ws/price');

let lastPrice = 0;

async function start() {
  console.log('🚀 Starting Bot BTCUSDT...');

  const balance = await getBalance();
  console.log('💰 Balance:', balance);

  if (!balance || balance <= 0) {
    console.log('⚠️ Saldo kosong → MODE ANALISA BTCUSDT');

    setInterval(() => {
      const price = getPrice();
      if (!price) return;

      console.log('📊 BTCUSDT PRICE:', price);

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
