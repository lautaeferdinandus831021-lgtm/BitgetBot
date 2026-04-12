const axios = require('axios');

async function getPrice(symbol = 'BTCUSDT') {
    try {
        const res = await axios.get(
            `https://api.bitget.com/api/v2/spot/market/ticker?symbol=${symbol}`
        );

        return parseFloat(res.data.data[0].lastPr);

    } catch (err) {
        console.log('❌ PRICE ERROR:', err.response?.data || err.message);
        return null;
    }
}

module.exports = { getPrice };
