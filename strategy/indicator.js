function EMA(period, values){
  const k = 2 / (period + 1);
  let ema = values[0];

  for(let i=1;i<values.length;i++){
    ema = values[i]*k + ema*(1-k);
  }

  return ema;
}

function MACD(values, fast, slow, signalPeriod){
  if(values.length < slow) return null;

  const fastEMA = EMA(fast, values);
  const slowEMA = EMA(slow, values);

  const macdLine = fastEMA - slowEMA;

  const signal = macdLine; // simple (fast bot)
  const histogram = macdLine - signal;

  return {
    macd: macdLine,
    signal: signal,
    histogram: histogram
  };
}

module.exports = { MACD };
