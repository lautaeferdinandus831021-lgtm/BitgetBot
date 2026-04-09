require('dotenv').config({ path: '.env.market' });
const axios = require('axios');

const SYMBOL = process.env.SYMBOL;
const PRODUCT_TYPE = process.env.PRODUCT_TYPE;
const LIMIT = process.env.LIMIT;

async function getCandles(granularity){
  const res = await axios.get('https://api.bitget.com/api/v2/mix/market/candles', {
    params: {
      symbol: SYMBOL,
      productType: PRODUCT_TYPE,
      granularity: granularity,
      limit: LIMIT
    }
  });

  return res.data.data.map(c => parseFloat(c[4])); // CLOSE PRICE
}

async function loadHistory(state){
  try{
    console.log("⏳ LOAD HISTORY...");

    state.m1Closes = await getCandles(process.env.GRANULARITY_M1);
    state.m5Closes = await getCandles(process.env.GRANULARITY_M5);

    console.log("✅ HISTORY LOADED");
    console.log(
      "M1:", state.m1Closes.length,
      "M5:", state.m5Closes.length
    );

  }catch(err){
    console.log("❌ HISTORY ERROR:", err.response?.data || err.message);
  }
}

module.exports = { loadHistory };
