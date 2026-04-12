const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const PASSPHRASE = process.env.API_PASSPHRASE;

const BASE_URL = 'https://api.bitget.com';

function sign(timestamp, method, requestPath, body = '') {
  const message = timestamp + method + requestPath + body;
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(message)
    .digest('base64');
}

async function getBalance() {
  try {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const requestPath = '/api/v2/spot/account/assets';

    const signature = sign(timestamp, method, requestPath);

    const res = await axios.get(BASE_URL + requestPath, {
      headers: {
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json'
      }
    });

    return res.data;

  } catch (err) {
    console.error('❌ BALANCE ERROR:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { getBalance };
