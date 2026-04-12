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
