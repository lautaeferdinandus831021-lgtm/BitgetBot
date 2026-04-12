const axios = require('axios');
const { headers } = require('../auth/apiManager');

const BASE_URL = 'https://api.bitget.com';

async function placeOrder(order) {
    try {
        const path = '/api/v2/mix/order/place-order';

        const body = JSON.stringify({
            symbol: order.pair,
            productType: 'USDT-FUTURES',
            marginMode: 'crossed',
            marginCoin: 'USDT',
            size: order.size.toString(),
            side: order.side,
            orderType: order.type,
            force: 'gtc'
        });

        const res = await axios.post(
            BASE_URL + path,
            body,
            { headers: headers('POST', path, body) }
        );

        console.log('🚀 FUTURES ORDER SUCCESS:', res.data);

    } catch (err) {
        console.log('❌ FUTURES ERROR:', err.response?.data || err.message);
    }
}

module.exports = { placeOrder };
