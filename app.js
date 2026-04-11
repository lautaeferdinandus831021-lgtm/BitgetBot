require('dotenv').config();

const WebSocket = require('ws');
const { buildCandle } = require('./strategy/candleBuilder');
const { filterSignal } = require('./strategy/signalState');
const { getBalance, placeOrder } = require('./core/api');

const wss = new WebSocket.Server({ port: 3000 });
let clients = [];

wss.on('connection', (ws) => clients.push(ws));

function broadcast(data) {
  clients.forEach(c => c.send(JSON.stringify(data)));
}

// ===== DATA =====
let m1 = [];
let m5 = [];

// ===== INDICATOR =====
function ema(period, data) {
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}

function stddev(data) {
  const mean = data.reduce((a,b)=>a+b)/data.length;
  return Math.sqrt(data.reduce((a,b)=>a+Math.pow(b-mean,2),0)/data.length);
}

function rsi(data, period = 7) {
  if (data.length < period + 1) return null;

  let gains = 0, losses = 0;

  for (let i = data.length - period; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  const rs = gains / (losses || 1);
  return 100 - (100 / (1 + rs));
}

// ===== ANALYZE =====
function analyze() {
  if (m1.length < 20) return null;

  const data = m1.slice(-20);

  // MACD
  const macd = ema(4, data) - ema(5, data);
  const signal = macd;
  const histogram = macd - signal;

  // BB
  const sma = data.reduce((a,b)=>a+b)/data.length;
  const sd = stddev(data);

  const bb = {
    upper: sma + 2*sd,
    middle: sma,
    lower: sma - 2*sd
  };

  // RSI
  const rsiVal = rsi(m1);

  // SIGNAL
  let signalTrade = null;

  if (macd > 0 && rsiVal < 70 && data[data.length-1] < bb.middle) {
    signalTrade = 'buy';
  }

  if (macd < 0 && rsiVal > 30 && data[data.length-1] > bb.middle) {
    signalTrade = 'sell';
  }

  return { macd, histogram, bb, rsi: rsiVal, signalTrade };
}

// ===== MODE =====
let mode = 'ANALYZE';

async function updateMode() {
  const balance = await getBalance().catch(()=>0);
  mode = (!balance || balance <= 0) ? 'ANALYZE' : 'TRADE';
}
setInterval(updateMode, 10000);

// ===== LOOP =====
setInterval(() => {
  const price = 72800 + Math.random() * 200;

  const { closed } = buildCandle(price);
  if (!closed) return;

  m1.push(closed.close);

  // 🔥 build M5 dari M1
  if (m1.length % 5 === 0) {
    m5.push(closed.close);
  }

  const result = analyze();
  if (!result) return;

  const finalSignal = filterSignal(result.signalTrade);

  // AUTO TRADE
  if (mode === 'TRADE' && finalSignal) {
    console.log('🚀 EXECUTE:', finalSignal);
    placeOrder(finalSignal);
  }

  broadcast({
    candle: {
      time: Math.floor(Date.now()/1000),
      open: closed.open,
      high: closed.high,
      low: closed.low,
      close: closed.close
    },
    m5: m5[m5.length - 1],
    bb: result.bb,
    macd: result.macd,
    hist: result.histogram,
    rsi: result.rsi,
    signal: finalSignal
  });

}, 1000);

console.log('🚀 FULL SYSTEM RUNNING ws://localhost:3000');
