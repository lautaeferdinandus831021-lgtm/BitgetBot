const { getBalance, placeOrder } = require('./core/api');

// dummy function (ganti dengan websocket kamu)
function getPrice() {
  return Math.floor(Math.random() * 1000) + 27000;
}

async function start() {
  console.log('🚀 Starting Bot...');

  try {
    const balance = await getBalance();
    console.log('💰 Balance:', balance);

    if (!balance || balance <= 0) {
      console.log('⚠️ Saldo kosong → MODE ANALISA SAJA');

      setInterval(() => {
        const price = getPrice();
        console.log('📊 PRICE:', price);

        if (price > 27500) {
          console.log('📈 SIGNAL: SELL');
        } else {
          console.log('📉 SIGNAL: BUY');
        }
      }, 3000);

      return;
    }

    console.log('✅ Saldo ada → MODE TRADING');

    setTimeout(() => {
      placeOrder('buy');
    }, 5000);

  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
}

start();
