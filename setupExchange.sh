mkdir -p modules/exchange/spot
mkdir -p modules/exchange/futures
mkdir -p modules/exchange/auth

# =========================
# API MANAGER (AUTH)
# =========================
cat << 'EOL' > modules/exchange/auth/apiManager.js
require('dotenv').config();
const crypto = require('crypto');

function sign(message, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64');
}

function getHeaders(method, path, body = '') {
    const timestamp = Date.now().toString();
    const message = timestamp + method + path + body;

    const signature = sign(message, process.env.API_SECRET);

    return {
        'ACCESS-KEY': process.env.API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        'Content-Type': 'application/json'
    };
}

module.exports = { getHeaders };
EOL

# =========================
# SPOT CLIENT
# =========================
cat << 'EOL' > modules/exchange/spot/client.js
const axios = require('axios');
const { getHeaders } = require('../auth/apiManager');

const BASE = process.env.BASE_URL;

async function placeOrder(order) {
    const path = '/api/spot/v1/trade/orders';
    const url = BASE + path;

    const body = JSON.stringify({
        symbol: order.pair,
        side: order.side,
        size: order.size,
        type: order.type
    });

    const headers = getHeaders('POST', path, body);

    try {
        const res = await axios.post(url, JSON.parse(body), { headers });
        console.log('✅ SPOT ORDER:', res.data);
    } catch (err) {
        console.log('❌ SPOT ERROR:', err.response?.data || err.message);
    }
}

module.exports = { placeOrder };
EOL

# =========================
# FUTURES CLIENT
# =========================
cat << 'EOL' > modules/exchange/futures/client.js
const axios = require('axios');
const { getHeaders } = require('../auth/apiManager');

const BASE = process.env.BASE_URL;

async function placeOrder(order) {
    const path = '/api/mix/v1/order/placeOrder';
    const url = BASE + path;

    const body = JSON.stringify({
        symbol: order.pair,
        marginCoin: 'USDT',
        size: order.size,
        side: order.side,
        orderType: order.type
    });

    const headers = getHeaders('POST', path, body);

    try {
        const res = await axios.post(url, JSON.parse(body), { headers });
        console.log('🚀 FUTURES ORDER:', res.data);
    } catch (err) {
        console.log('❌ FUTURES ERROR:', err.response?.data || err.message);
    }
}

module.exports = { placeOrder };
EOL

echo "🔥 Exchange module ready"
