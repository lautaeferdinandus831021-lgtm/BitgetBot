
const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = 'https://api.bitget.com';

function sign(timestamp, method, path, body = ''){
  const message = timestamp + method + path + body;
  return crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(message)
    .digest('base64');
}

async function getBalance(){

  try{

    const timestamp = Date.now().toString();
    const method = 'GET';
    const path = '/api/v2/mix/account/accounts';
    const query = '?productType=USDT-FUTURES';

    const signStr = sign(timestamp, method, path + query);

    const res = await axios.get(BASE_URL + path + query, {
      headers: {
        'ACCESS-KEY': process.env.API_KEY,
        'ACCESS-SIGN': signStr,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': process.env.API_PASSPHRASE,
        'Content-Type': 'application/json'
      }
    });

    if(res.data.code !== "00000"){
      console.log("❌ BALANCE ERROR:", res.data);
      return 0;
    }

    const data = res.data.data;

    // ambil USDT
    const usdt = data.find(a => a.marginCoin === 'USDT');

    if(!usdt) return 0;

    const balance = parseFloat(usdt.available);

    console.log("💰 BALANCE:", balance);

    return balance;

  }catch(err){
    console.log("❌ BALANCE FETCH ERROR:", err.message);
    return 0;
  }
}

module.exports = { getBalance };

