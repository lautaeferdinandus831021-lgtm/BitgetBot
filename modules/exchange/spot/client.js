const axios = require('axios');
const { headers } = require('../auth/apiManager');

const BASE_URL = 'https://api.bitget.com';

async function placeOrder(order) {
    try {
        const path = '/api/v2/spot/trade/place-order';

        const body = JSON.stringify({
            symbol: order.pair,
            side: order.side,
            orderType: order.type,
            force: 'gtc',
            size: order.size.toString()
        });

        const res = await axios.post(
            BASE_URL + path,
            body,
            { headers: headers('POST', path, body) }
        );

        console.log('✅ SPOT ORDER SUCCESS:', res.data);

    } catch (err) {
        console.log('❌ SPOT ERROR:', err.response?.data || err.message);
    }
}

module.exports = { placeOrder };
