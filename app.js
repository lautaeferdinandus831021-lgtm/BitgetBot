require('dotenv').config();
const { WebsocketClientV2 } = require('bitget-api');

const ws = new WebsocketClientV2();

const SYMBOL = "BTCUSDT";
const PRODUCT_TYPE = "USDT-FUTURES";

// ✅ SUBSCRIBE BENAR
ws.subscribeTopic({
  channel: "candle1m",
  instId: SYMBOL,
  instType: PRODUCT_TYPE,
});

// LISTENER
ws.on('update', (msg) => {
  console.log("DATA:", msg);
});

ws.on('open', () => {
  console.log("🚀 WS CONNECTED");
});

ws.on('error', (err) => {
  console.log("❌ WS ERROR:", err);
});
