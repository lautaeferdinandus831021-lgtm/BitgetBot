require('dotenv').config();
const { WebsocketClientV2 } = require('bitget-api'); // 🔥 FIX

const ws = new WebsocketClientV2({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  apiPass: process.env.PASSPHRASE,
});

// TEST
ws.subscribeTopic('mc', 'candle1m:BTCUSDT');

ws.on('update', (msg) => {
  console.log("DATA:", msg);
});

console.log("🚀 WS CONNECTED");
