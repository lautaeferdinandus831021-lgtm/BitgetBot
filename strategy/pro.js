function ema(data, period){
  let k = 2 / (period + 1);
  let emaArr = [data[0]];

  for(let i=1;i<data.length;i++){
    emaArr.push(data[i]*k + emaArr[i-1]*(1-k));
  }

  return emaArr;
}

function macd(data, fast, slow, signal){
  const fastEma = ema(data, fast);
  const slowEma = ema(data, slow);

  const macdLine = fastEma.map((v,i)=> v - slowEma[i]);
  const signalLine = ema(macdLine, signal);

  return {
    macd: macdLine,
    signal: signalLine
  };
}

function crossUp(macd, signal){
  const i = macd.length - 1;
  return macd[i-1] < signal[i-1] && macd[i] > signal[i];
}

function crossDown(macd, signal){
  const i = macd.length - 1;
  return macd[i-1] > signal[i-1] && macd[i] < signal[i];
}

function analyze(state){

  const m1 = state.m1Closes;
  const m5 = state.m5Closes;

  // ===== MACD M1 (ANALISA) =====
  const macd1 = macd(m1,2,3,1);
  const macd2 = macd(m1,3,4,1);
  const macd3 = macd(m1,4,5,1);

  // ===== MACD M5 (FILTER TREND) =====
  const macdM5 = macd(m5,4,5,1);

  const trendUp = macdM5.macd.slice(-1)[0] > macdM5.signal.slice(-1)[0];
  const trendDown = macdM5.macd.slice(-1)[0] < macdM5.signal.slice(-1)[0];

  let buyScore = 0;
  let sellScore = 0;

  // ===== SCORING =====
  if(crossUp(macd1.macd, macd1.signal)) buyScore++;
  if(crossUp(macd2.macd, macd2.signal)) buyScore++;
  if(crossUp(macd3.macd, macd3.signal)) buyScore++;

  if(crossDown(macd1.macd, macd1.signal)) sellScore++;
  if(crossDown(macd2.macd, macd2.signal)) sellScore++;
  if(crossDown(macd3.macd, macd3.signal)) sellScore++;

  // ===== ANTI NOISE =====
  if(buyScore < 2 && sellScore < 2) return null;

  // ===== FINAL SIGNAL =====
  if(buyScore >= 2 && trendUp){
    return { type:'BUY' };
  }

  if(sellScore >= 2 && trendDown){
    return { type:'SELL' };
  }

  return null;
}

module.exports = { analyze };
