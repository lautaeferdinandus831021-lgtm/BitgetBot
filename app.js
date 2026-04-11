require('dotenv').config();

const { connect } = require('./ws/market');
const { getBalance } = require('./core/api');

console.log('🚀 Starting Bot...');

connect();

setInterval(async () => {
  const bal = await getBalance();
  console.log('💰 Balance:', bal);
}, 10000);

const { placeOrder } = require('./core/api');

// test BUY setelah 5 detik
setTimeout(() => {
  console.log('🧪 TEST ORDER BUY...');
  placeOrder('buy');
}, 5000);


// ===== TEST ORDER =====
const { placeOrder } = require('./core/api');

setTimeout(() => {
  console.log('🧪 TEST ORDER BUY...');
  placeOrder('buy');
}, 5000);

