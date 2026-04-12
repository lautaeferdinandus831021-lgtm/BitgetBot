require('dotenv').config();
const { RestClientV2 } = require('bitget-api');
const { EMA, RSI, MACD } = require('technicalindicators');

// CONFIG
const SYMBOL = process.env.SYMBOL;
const PRODUCT_TYPE = process.env.PRODUCT_TYPE;
const SIZE = process.env.SIZE;

// INIT CLIENT
const client = new RestClientV2({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  apiPass: process.env.PASSPHRASE,
});

// STATE
let prices = [];

// GET MARKET DATA
async function getCandles() {
  const res = await client.getFuturesCandles({
    symbol: SYMBOL,
    productType: PRODUCT_TYPE,
    granularity: '1m',
    limit: '100'
  });

  return res.data.map(c => parseFloat(c[4])); // close price
}

// GET BALANCE
async function getBalance() {
  try {
    const res = await client.getFuturesAccountAssets({
      productType: PRODUCT_TYPE,
    });

    const usdt = res.data.find(a => a.marginCoin === 'USDT');
    return parseFloat(usdt.available);
  } catch (e) {
    console.log("❌ BALANCE ERROR:", e.body || e.message);
    return 0;
  }
}

// ANALYSIS
function analyze(prices) {
  if (prices.length < 30) return null;

  const ema5 = EMA.calculate({ period: 5, values: prices });
  const emaTrend = ema5[ema5.length - 1];

  const rsi4 = RSI.calculate({ period: 4, values: prices });
  const rsi5 = RSI.calculate({ period: 5, values: prices });
  const rsi25 = RSI.calculate({ period: 25, values: prices });

  const macd = MACD.calculate({
    values: prices,
    fastPeriod: 4,
    slowPeriod: 5,
    signalPeriod: 3,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  const lastMACD = macd[macd.length - 1];
  const prevMACD = macd[macd.length - 2];

  const price = prices[prices.length - 1];

  // SIGNAL
  let signal = null;

  const bullishCross = prevMACD.MACD < prevMACD.signal && lastMACD.MACD > lastMACD.signal;
  const bearishCross = prevMACD.MACD > prevMACD.signal && lastMACD.MACD < lastMACD.signal;

  if (
    bullishCross &&
    rsi4[rsi4.length - 1] > 50 &&
    rsi5[rsi5.length - 1] > 50 &&
    price > emaTrend
  ) {
    signal = "BUY";
  }

  if (
    bearishCross &&
    rsi4[rsi4.length - 1] < 50 &&
    rsi5[rsi5.length - 1] < 50 &&
    price < emaTrend
  ) {
    signal = "SELL";
  }

  return { signal, price };
}

// EXECUTE ORDER
async function execute(signal) {
  try {
    const side = signal === "BUY" ? "buy" : "sell";

    const res = await client.submitOrder({
      symbol: SYMBOL,
      productType: PRODUCT_TYPE,
      marginMode: "crossed",
      marginCoin: "USDT",
      size: SIZE,
      side: side,
      orderType: "market",
    });

    console.log("✅ ORDER:", signal, res.data);
  } catch (e) {
    console.log("❌ ORDER ERROR:", e.body || e.message);
  }
}

// MAIN LOOP
async function run() {
  console.log("🚀 BOT STARTED (REALTIME)");

  setInterval(async () => {
    try {
      prices = await getCandles();

      const result = analyze(prices);
      if (!result) return;

      const { signal, price } = result;

      console.log("PRICE:", price);
      console.log("SIGNAL:", signal);

      const balance = await getBalance();

      if (balance < 10) {
        console.log("⚠️ ANALYSIS ONLY (saldo < 10)");
        return;
      }

      if (signal) {
        await execute(signal);
      }

    } catch (e) {
      console.log("❌ ERROR:", e.message);
    }
  }, 5000);
}

run();
