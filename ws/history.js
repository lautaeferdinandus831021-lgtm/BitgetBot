const axios = require('axios');

async function loadHistory(state){
  try{

    console.log("📥 LOAD HISTORY...");

    // ===== M1 =====
    const m1 = await axios.get(
      "https://api.bitget.com/api/mix/v1/market/candles",
      {
        params: {
          symbol: "BTCUSDT_UMCBL",
          granularity: "60",
          limit: 100
        }
      }
    );

    state.m1Closes = m1.data.map(c => parseFloat(c[4]));

    // ===== M5 =====
    const m5 = await axios.get(
      "https://api.bitget.com/api/mix/v1/market/candles",
      {
        params: {
          symbol: "BTCUSDT_UMCBL",
          granularity: "300",
          limit: 100
        }
      }
    );

    state.m5Closes = m5.data.map(c => parseFloat(c[4]));

    // 🔥 pastikan urutan lama -> baru
    state.m1Closes.reverse();
    state.m5Closes.reverse();

    console.log(
      "✅ HISTORY LOADED",
      "M1:", state.m1Closes.length,
      "M5:", state.m5Closes.length
    );

  }catch(err){
    console.log("❌ HISTORY ERROR", err.message);
  }
}

module.exports = { loadHistory };
