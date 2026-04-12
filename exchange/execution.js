const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const API_PASSPHRASE = process.env.API_PASSPHRASE;

const BASE_URL = 'https://api.bitget.com';

// 🔐 SIGNATURE
function sign(timestamp, method, requestPath, body = '') {
    const message = timestamp + method + requestPath + body;
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(message)
        .digest('base64');
}

// 💰 GET BALANCE
async function getBalance() {
    try {
        const timestamp = Date.now().toString();
        const path = '/api/v2/spot/account/assets';

        const signature = sign(timestamp, 'GET', path);

        const res = await axios.get(BASE_URL + path, {
            headers: {
                'ACCESS-KEY': API_KEY,
                'ACCESS-SIGN': signature,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-PASSPHRASE': API_PASSPHRASE
            }
        });

        const usdt = res.data.data.find(a => a.coin === 'USDT');

        return usdt ? parseFloat(usdt.available) : 0;

    } catch (err) {
        console.log("❌ BALANCE ERROR:", err.response?.data || err.message);
        return 0;
    }
}

// 📈 PLACE ORDER
async function placeOrder({ pair, side, size }) {
    try {
        const timestamp = Date.now().toString();
        const path = '/api/v2/spot/trade/place-order';

        const body = JSON.stringify({
            symbol: pair,
            side: side,
            orderType: 'market',
            force: 'gtc',
            size: size.toString()
        });

        const signature = sign(timestamp, 'POST', path, body);

        const res = await axios.post(BASE_URL + path, body, {
            headers: {
                'ACCESS-KEY': API_KEY,
                'ACCESS-SIGN': signature,
                'ACCESS-TIMESTAMP': timestamp,
                'ACCESS-PASSPHRASE': API_PASSPHRASE,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ ORDER SUCCESS:", res.data);

        return res.data;

    } catch (err) {
        console.log("❌ ORDER ERROR:", err.response?.data || err.message);
    }
}

module.exports = {
    getBalance,
    placeOrder
};
