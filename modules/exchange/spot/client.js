require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const PASSPHRASE = process.env.API_PASSPHRASE;

const BASE_URL = 'https://api.bitget.com';

function sign(timestamp, method, requestPath, body = '') {
    const prehash = timestamp + method + requestPath + body;
    return crypto.createHmac('sha256', API_SECRET)
        .update(prehash)
        .digest('base64');
}

async function placeOrder(order) {
    try {
        const timestamp = Date.now().toString();
        const method = 'POST';
        const requestPath = '/api/v2/spot/trade/place-order';

        const body = JSON.stringify({
            symbol: order.pair,
            side: order.side,
            orderType: order.type,
            force: 'gtc',
            size: order.size.toString()
        });

        const signature = sign(timestamp, method, requestPath, body);

        const res = await axios.post(
            BASE_URL + requestPath,
            body,
            {
                headers: {
                    'ACCESS-KEY': API_KEY,
                    'ACCESS-SIGN': signature,
                    'ACCESS-TIMESTAMP': timestamp,
                    'ACCESS-PASSPHRASE': PASSPHRASE,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ ORDER SUCCESS:', res.data);

    } catch (err) {
        console.log('❌ SPOT ERROR:', err.response?.data || err.message);
    }
}

module.exports = { placeOrder };
