const axios = require('axios');

async function getPrice() {
    try {
        const res = await axios.get(
            'https://api.bitget.com/api/v2/spot/market/ticker?symbol=BTCUSDT'
        );

        const price = parseFloat(res.data.data[0].lastPr);
        return price;

    } catch (err) {
        console.log('❌ PRICE ERROR:', err.message);
        return null;
    }
}

module.exports = { getPrice };
