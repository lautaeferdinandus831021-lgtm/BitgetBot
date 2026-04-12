const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const PASSPHRASE = process.env.API_PASSPHRASE;

const BASE_URL = 'https://api.bitget.com';

function sign(timestamp, method, path, body = '') {
  const message = timestamp + method + path + body;
  return crypto.createHmac('sha256', API_SECRET).update(message).digest('base64');
}

async function placeOrder({ symbol, side, size }) {
  try {
    const timestamp = Date.now().toString();

    const path = '/api/v2/spot/trade/place-order';

    const body = JSON.stringify({
      symbol,
      side,
      orderType: 'market',
      size
    });

    const headers = {
      'ACCESS-KEY': API_KEY,
      'ACCESS-SIGN': sign(timestamp, 'POST', path, body),
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': PASSPHRASE,
      'Content-Type': 'application/json'
    };

    const res = await axios.post(BASE_URL + path, body, { headers });

    console.log('ORDER SUCCESS:', res.data);
    return res.data;

  } catch (err) {
    console.error('ORDER ERROR:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { placeOrder };
