const { MACD } = require('./indicator');

function analyze(state){

  const m1 = state.m1Closes || [];
  const m5 = state.m5Closes || [];

  if(m1.length < 10 || m5.length < 10) return null;

  // ===== MACD M1 =====
  const fast = MACD(m1,2,3,1);
  const mid  = MACD(m1,3,4,1);
  const slow = MACD(m1,4,5,1);

  // ===== TREND M5 =====
  const trend = MACD(m5,4,5,1);

  if(!fast || !mid || !slow || !trend) return null;

  // ===== FILTER TREND =====
  const uptrend = trend.histogram > 0;
  const downtrend = trend.histogram < 0;

  // ===== ANTI NOISE =====
  const confirmBuy =
    fast.histogram > 0 &&
    mid.histogram > 0 &&
    slow.histogram > 0;

  const confirmSell =
    fast.histogram < 0 &&
    mid.histogram < 0 &&
    slow.histogram < 0;

  // ===== SIGNAL =====
  if(confirmBuy && uptrend){
    return { type:'BUY' };
  }

  if(confirmSell && downtrend){
    return { type:'SELL' };
  }

  return null;
}

module.exports = { analyze };
