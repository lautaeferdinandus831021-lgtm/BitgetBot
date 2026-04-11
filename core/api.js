require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'https://api.bitget.com';

function sign(timestamp, method, requestPath, body = '') {
  const message = timestamp + method + requestPath + body;
  return crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(message)
    .digest('base64');
}

async function getBalance() {
  try {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const requestPath = '/api/mix/v1/account/accounts?productType=UMCBL';

    const signature = sign(timestamp, method, requestPath);

    const res = await axios.get(BASE_URL + requestPath, {
      headers: {
        'ACCESS-KEY': process.env.API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        'Content-Type': 'application/json'
      }
    });

    console.log('💰 BALANCE RAW:', res.data);

    if (res.data.data && res.data.data.length > 0) {
      const usdt = res.data.data.find(x => x.marginCoin === 'USDT');
      return usdt ? usdt.available : 0;
    }

    return 0;

  } catch (err) {
    console.log('❌ FULL ERROR:', err.response?.data || err.message);
    return 0;
  }
}

module.exports = { getBalance };
