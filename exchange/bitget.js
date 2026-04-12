const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const API_PASS = process.env.API_PASS;

const BASE_URL = 'https://api.bitget.com';

// SIGNATURE
function sign(timestamp, method, requestPath, body = '') {
  const message = timestamp + method + requestPath + body;
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(message)
    .digest('base64');
}

// HEADERS
function headers(method, path, body = '') {
  const timestamp = Date.now().toString();

  return {
    'ACCESS-KEY': API_KEY,
    'ACCESS-SIGN': sign(timestamp, method, path, body),
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': API_PASS,
    'Content-Type': 'application/json',
  };
}

// GET PRICE (FIXED)
async function getPrice(symbol = 'BTCUSDT') {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/v2/spot/market/tickers?symbol=${symbol}`
    );

    return parseFloat(res.data.data[0].lastPr);
  } catch (err) {
    console.error('PRICE ERROR:', err.response?.data || err.message);
    return null;
  }
}

// GET BALANCE
async function getBalance() {
  try {
    const path = '/api/v2/spot/account/assets';
    const res = await axios.get(BASE_URL + path, {
      headers: headers('GET', path),
    });

    return res.data.data;
  } catch (err) {
    console.error('BALANCE ERROR:', err.response?.data || err.message);
    return [];
  }
}

// PLACE ORDER (FIXED)
async function placeOrder(symbol, side, size) {
  try {
    const path = '/api/v2/spot/trade/place-order';

    const body = JSON.stringify({
      symbol: symbol,
      side: side,
      orderType: 'market',
      force: 'normal',
      size: size.toString(),
    });

    const res = await axios.post(BASE_URL + path, body, {
      headers: headers('POST', path, body),
    });

    console.log('ORDER SUCCESS:', res.data);
    return res.data;
  } catch (err) {
    console.error('ORDER ERROR:', err.response?.data || err.message);
    return null;
  }
}

module.exports = {
  getPrice,
  getBalance,
  placeOrder,
};
