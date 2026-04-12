const axios = require('axios');

module.exports = async function getPrice(pair) {
    try {
        // format pair BTCUSDT → BTC-USDT (Bitget)
        const symbol = pair.replace('USDT', '-USDT');

        const res = await axios.get(
            `https://api.bitget.com/api/spot/v1/market/ticker?symbol=${symbol}`
        );

        if (res.data && res.data.data) {
            return parseFloat(res.data.data.close);
        }

        return null;

    } catch (err) {
        console.log("PRICE ERROR:", err.response?.data || err.message);
        return null;
    }
};
