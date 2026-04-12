require('dotenv').config();
const { WebsocketClient } = require('bitget-api');
const { EMA, RSI, MACD } = require('technicalindicators');

const ws = new WebsocketClient();

// ===== STATE =====
let candles1m = [];
let candles5m = [];
let buffer = [];

// ===== BUILD 5M CANDLE FROM 1M =====
function build5m(candle) {
  buffer.push(candle);

  if (buffer.length === 5) {
    const open = buffer[0].open;
    const close = buffer[4].close;
    const high = Math.max(...buffer.map(c => c.high));
    const low = Math.min(...buffer.map(c => c.low));

    candles5m.push({ open, high, low, close });

    console.log("🕯️ NEW 5M:", { open, high, low, close });

    buffer = [];
  }
}

// ===== ANALYSIS =====
function analyze() {
  if (candles1m.length < 30 || candles5m.length < 10) return;

  // ===== 1M TREND =====
  const prices1m = candles1m.map(c => c.close);

  const ema1m = EMA.calculate({ period: 5, values: prices1m });
  const rsi1m = RSI.calculate({ period: 5, values: prices1m });

  const trendUp = prices1m.at(-1) > ema1m.at(-1);
  const trendDown = prices1m.at(-1) < ema1m.at(-1);

  // ===== 5M ENTRY =====
  const prices5m = candles5m.map(c => c.close);

  const macd = MACD.calculate({
    values: prices5m,
    fastPeriod: 4,
    slowPeriod: 5,
    signalPeriod: 3,
  });

  if (macd.length < 2) return;

  const prev = macd.at(-2);
  const curr = macd.at(-1);

  let signal = null;

  const bullish = prev.MACD < prev.signal && curr.MACD > curr.signal;
  const bearish = prev.MACD > prev.signal && curr.MACD < curr.signal;

  if (trendUp && bullish && rsi1m.at(-1) > 50) {
    signal = "BUY";
  }

  if (trendDown && bearish && rsi1m.at(-1) < 50) {
    signal = "SELL";
  }

  console.log("📊 1M TREND:", trendUp ? "UP" : "DOWN");
  console.log("📈 5M SIGNAL:", signal);
}

// ===== STREAM 1M CANDLE =====
ws.subscribeTopic('mc', 'candle1m:BTCUSDT');

ws.on('update', (msg) => {
  const data = msg?.data?.[0];
  if (!data) return;

  const candle = {
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low),
    close: parseFloat(data.close),
  };

  candles1m.push(candle);
  if (candles1m.length > 100) candles1m.shift();

  build5m(candle);
  analyze();
});

console.log("🚀 MTF REAL (1m→5m builder)");
