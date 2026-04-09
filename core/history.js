const axios = require('axios');

async function getCandles(granularity){
  const res = await axios.get('https://api.bitget.com/api/v2/mix/market/candles', {
    params: {
      symbol: 'BTCUSDT',
      productType: 'USDT-FUTURES',
      granularity,
      limit: 100
    }
  });

  return res.data.data.map(c => parseFloat(c[4]));
}

async function loadHistory(state){
  try{
    console.log("⏳ LOAD HISTORY...");

    state.m1Closes = await getCandles('1m');
    state.m5Closes = await getCandles('5m');

    console.log("✅ HISTORY LOADED");
    console.log("M1:", state.m1Closes.length, "M5:", state.m5Closes.length);

  }catch(err){
    console.log("❌ HISTORY ERROR:", err.response?.data || err.message);
  }
}

module.exports = { loadHistory };
