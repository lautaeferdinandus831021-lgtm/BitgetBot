const axios = require('axios');

const BASE_URL = 'https://api.bitget.com';

async function getCandles(granularity){
  try{
    const res = await axios.get(`${BASE_URL}/api/v2/mix/market/candles`, {
      params: {
        symbol: 'BTCUSDT',
        productType: 'USDT-FUTURES',
        granularity: granularity,
        limit: 100
      }
    });

    // format: [time, open, high, low, close, volume]
    return res.data.data.map(c => parseFloat(c[4]));

  }catch(err){
    console.log("❌ HISTORY ERROR:", err.response?.data || err.message);
    return [];
  }
}

async function loadHistory(state){
  console.log("📥 LOAD HISTORY...");

  const m1 = await getCandles('1m');
  const m5 = await getCandles('5m');

  state.m1Closes = m1;
  state.m5Closes = m5;

  console.log("✅ HISTORY LOADED:",
    "M1:", m1.length,
    "M5:", m5.length
  );
}

module.exports = { loadHistory };
