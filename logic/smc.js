function generateSMCSignal(c){
  if(!c.length) return null;

  const last = c.slice(-10);
  const high = Math.max(...last.map(x=>x.high||0));
  const low = Math.min(...last.map(x=>x.low||999999));
  const close = last[last.length-1]?.close || 0;

  if(close > high*0.995) return {type:'BUY'};
  if(close < low*1.005) return {type:'SELL'};
  return null;
}
module.exports={generateSMCSignal};
