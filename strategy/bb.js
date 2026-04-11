
function sma(data, period){
  if(data.length < period) return null;
  const slice = data.slice(-period);
  const sum = slice.reduce((a,b)=>a+b,0);
  return sum / period;
}

function stdDev(data, period){
  if(data.length < period) return null;
  const slice = data.slice(-period);
  const mean = sma(data, period);
  const variance = slice.reduce((a,b)=>a + Math.pow(b - mean, 2), 0) / period;
  return Math.sqrt(variance);
}

function bollinger(data, period=5, dev=1.2){
  const mid = sma(data, period);
  const std = stdDev(data, period);
  if(!mid || !std) return null;

  return {
    mid,
    upper: mid + dev * std,
    lower: mid - dev * std
  };
}

module.exports = { bollinger };

