const axios = require('axios');

module.exports = async function getPrice(pair) {
    try {
        // BTCUSDT → BTCUSDT (V2 pakai ini)
        const symbol = pair;

        const res = await axios.get(
            `https://api.bitget.com/api/v2/spot/market/tickers?symbol=${symbol}`
        );

        if (res.data && res.data.data && res.data.data.length > 0) {
            return parseFloat(res.data.data[0].lastPr);
        }

        return null;

    } catch (err) {
        console.log("PRICE ERROR:", err.response?.data || err.message);
        return null;
    }
};
