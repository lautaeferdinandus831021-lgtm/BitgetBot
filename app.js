require('dotenv').config();

const { placeOrder } = require('./core/api');

console.log('🚀 Starting Bot...');

// test BUY
setTimeout(() => {
  console.log('🧪 TEST ORDER BUY...');
  placeOrder('buy');
}, 5000);

