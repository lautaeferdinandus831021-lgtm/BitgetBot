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
