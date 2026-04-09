const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const PASSPHRASE = process.env.API_PASSPHRASE;

function sign(timestamp, method, path, body = ''){
  const message = timestamp + method + path + body;
  return crypto
    .createHmac('sha256', API_SECRET)
    .update(message)
    .digest('base64');
}

async function getBalance(){

  const timestamp = Date.now().toString();
  const path = "/api/v2/mix/account/accounts?productType=USDT-FUTURES";
  const url = "https://api.bitget.com" + path;

  const signValue = sign(timestamp, "GET", path);

  try{
    const res = await axios.get(url, {
      headers: {
        "ACCESS-KEY": API_KEY,
        "ACCESS-SIGN": signValue,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-PASSPHRASE": PASSPHRASE
      }
    });

    const data = res.data.data;

    const usdt = data.find(acc => acc.marginCoin === "USDT");

    return usdt ? parseFloat(usdt.available) : 0;

  }catch(err){
    console.log("❌ BALANCE ERROR:", err.response?.data || err.message);
    return 0;
  }
}

module.exports = { getBalance };
