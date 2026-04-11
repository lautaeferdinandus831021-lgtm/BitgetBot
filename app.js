require('dotenv').config();
const { connect } = require('./ws/market');
const { getBalance } = require('./core/api');

console.log('🚀 Starting Bot...');

connect();

setInterval(async () => {
  const bal = await getBalance();
  console.log('💰 Balance:', bal);
}, 10000);
