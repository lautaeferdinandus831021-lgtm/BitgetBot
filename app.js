require('dotenv').config();
const { WebsocketClient, RestClientV2 } = require('bitget-api');
const { EMA, RSI, MACD } = require('technicalindicators');

// CONFIG
const SYMBOL = process.env.SYMBOL;
const PRODUCT_TYPE = process.env.PRODUCT_TYPE;

// INIT CLIENT
const ws = new WebsocketClient();
const rest = new RestClientV2({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  apiPass: process.env.PASSPHRASE,
});

// STATE
let prices = [];

// STREAM PRICE
ws.subscribeTopic('mc', `ticker:${SYMBOL}`);

ws.on('update', (data) => {
  if (data?.data?.[0]?.last) {
    const price = parseFloat(data.data[0].last);
    prices.push(price);

    if (prices.length > 100) prices.shift();

    runAnalysis();
  }
});

// ANALYSIS FUNCTION
function runAnalysis() {
  if (prices.length < 30) return;

  const ema5 = EMA.calculate({ period: 5, values: prices });
  const rsi4 = RSI.calculate({ period: 4, values: prices });
  const rsi5 = RSI.calculate({ period: 5, values: prices });
  const rsi25 = RSI.calculate({ period: 25, values: prices });

  const macd = MACD.calculate({
    values: prices,
    fastPeriod: 4,
    slowPeriod: 5,
    signalPeriod: 3,
  });

  const last = macd[macd.length - 1];
  const prev = macd[macd.length - 2];

  const price = prices[prices.length - 1];
  let signal = null;

  const bullish = prev.MACD < prev.signal && last.MACD > last.signal;
  const bearish = prev.MACD > prev.signal && last.MACD < last.signal;

  if (
    bullish &&
    rsi4.at(-1) > 50 &&
    rsi5.at(-1) > 50 &&
    price > ema5.at(-1)
  ) {
    signal = "BUY";
  }

  if (
    bearish &&
    rsi4.at(-1) < 50 &&
    rsi5.at(-1) < 50 &&
    price < ema5.at(-1)
  ) {
    signal = "SELL";
  }

  console.log("PRICE:", price);
  console.log("SIGNAL:", signal);
}

// PRIVATE API CHECK (BALANCE)
async function checkBalance() {
  try {
    const res = await rest.getFuturesAccountAssets({
      productType: PRODUCT_TYPE,
    });

    const usdt = res.data.find(x => x.marginCoin === "USDT");
    console.log("BALANCE:", usdt?.available);
  } catch (e) {
    console.log("API ERROR:", e.body || e.message);
  }
}

// LOOP PRIVATE CHECK
setInterval(checkBalance, 15000);

console.log("🚀 ANALYSIS MODE (REALTIME STREAM)");
