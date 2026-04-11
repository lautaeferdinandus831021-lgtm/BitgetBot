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
    const requestPath = '/api/v2/mix/account/accounts?productType=USDT-FUTURES';

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
    console.log('❌ BALANCE ERROR:', err.response?.data || err.message);
    return 0;
  }
}

module.exports = { getBalance };

async function placeOrder(side = 'buy') {
  try {
    const timestamp = Date.now().toString();
    const method = 'POST';
    const requestPath = '/api/v2/mix/order/place-order';

    const bodyObj = {
      symbol: process.env.SYMBOL,
      productType: 'USDT-FUTURES',
      marginMode: 'crossed',
      marginCoin: 'USDT',
      size: process.env.SIZE,
      side: side === 'buy' ? 'buy' : 'sell',
      tradeSide: 'open',
      orderType: 'market',
      force: 'ioc'
    };

    const body = JSON.stringify(bodyObj);

    const signature = sign(timestamp, method, requestPath, body);

    const res = await axios.post(BASE_URL + requestPath, bodyObj, {
      headers: {
        'ACCESS-KEY': process.env.API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        'Content-Type': 'application/json'
      }
    });

    console.log('🚀 ORDER SUCCESS:', res.data);
    return res.data;

  } catch (err) {
    console.log('❌ ORDER ERROR:', err.response?.data || err.message);
  }
}

module.exports.placeOrder = placeOrder;

