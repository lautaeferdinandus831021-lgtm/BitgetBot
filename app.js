require('dotenv').config();
const { WebsocketClientV2 } = require('bitget-api');

const ws = new WebsocketClientV2();

const SYMBOL = "BTCUSDT";

// ✅ FIX DI SINI
ws.subscribeTopic({
  channel: "candle1m",
  instId: SYMBOL,
  instType: "USDT-FUTURE", // 🔥 FIX
});

ws.on('open', () => {
  console.log("🚀 WS CONNECTED");
});

ws.on('update', (msg) => {
  console.log("📊 DATA:", msg);
});

ws.on('error', (err) => {
  console.log("❌ WS ERROR:", err);
});
