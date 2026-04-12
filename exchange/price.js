const axios = require('axios');

const BASE_URL = 'https://api.bitget.com';

async function getPrice(symbol = 'BTCUSDT') {
  try {
    const res = await axios.get(`${BASE_URL}/api/v2/spot/market/tickers`, {
      params: {
        symbol: symbol
      }
    });

    const data = res.data;

    if (!data || !data.data || data.data.length === 0) {
      throw new Error('No price data');
    }

    const price = parseFloat(data.data[0].lastPr);

    return price;

  } catch (err) {
    console.error('❌ PRICE ERROR:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { getPrice };
