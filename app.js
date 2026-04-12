const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

ws.on('open', () => {
  console.log('✅ WS Connected');

  ws.send(JSON.stringify({
    op: "subscribe",
    args: [{
      instType: "mc",
      channel: "ticker",
      instId: "BTCUSDT"
    }]
  }));
});

ws.on('message', (msg) => {
  try {
    const data = JSON.parse(msg.toString());

    // DEBUG (lihat isi data)
    // console.log(data);

    if (!data.data) return;

    const ticker = data.data[0];

    if (!ticker.last) return;

    const price = parseFloat(ticker.last);

    console.log('📈 BTCUSDT:', price);

    const signal = analyze(price);

    if (signal === 'buy') {
      console.log('🚀 BUY SIGNAL');
    }

    if (signal === 'sell') {
      console.log('🔥 SELL SIGNAL');
    }

  } catch (err) {
    console.log('❌ ERROR:', err.message);
  }
});

// auto reconnect (biar gak mati)
ws.on('close', () => {
  console.log('⚠️ WS Closed → reconnect...');
  setTimeout(() => process.exit(1), 2000);
});
