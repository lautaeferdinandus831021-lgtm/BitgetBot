require('dotenv').config();

const { placeOrder, getBalance } = require('./core/api');

console.log('🚀 Starting Bot...');

async function runBot() {
  const balance = await getBalance();
  console.log('💰 Balance:', balance);

  if (balance <= 0) {
    console.log('⚠️ Saldo kosong → MODE ANALISA SAJA');
    return;
  }

  console.log('🧪 TEST ORDER BUY...');
  placeOrder('buy');
}

// jalankan setelah 5 detik
setTimeout(runBot, 5000);

