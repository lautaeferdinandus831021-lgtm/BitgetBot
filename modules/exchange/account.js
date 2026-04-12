const axios = require('axios');
const { headers } = require('./auth/apiManager');

const BASE_URL = 'https://api.bitget.com';

async function getBalance() {
    try {
        const path = '/api/v2/spot/account/assets';

        const res = await axios.get(
            BASE_URL + path,
            { headers: headers('GET', path) }
        );

        const usdt = res.data.data.find(a => a.coin === 'USDT');

        return usdt ? parseFloat(usdt.available) : 0;

    } catch (err) {
        console.log('❌ BALANCE ERROR:', err.response?.data || err.message);
        return 0;
    }
}

module.exports = { getBalance };
