const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

let price = 0;

ws.on('open', () => {
  console.log('✅ WS Connected');

  ws.send(JSON.stringify({
    op: 'subscribe',
    args: [{
      instType: 'mc',
      channel: 'ticker',
      instId: 'BTCUSDT'
    }]
  }));
});

ws.on('message', (msg) => {
  try {
    const json = JSON.parse(msg);

    if (json.data && json.data[0]) {
      price = parseFloat(json.data[0].last);

      console.log('💰 BTCUSDT:', price);

      const signal = analyze(price);

      if (signal === 'BUY') {
        console.log('🚀 SIGNAL BUY');
      }

      if (signal === 'SELL') {
        console.log('🔥 SIGNAL SELL');
      }
    }
  } catch (e) {
    console.log('WS error parse');
  }
});

ws.on('close', () => {
  console.log('❌ WS Closed → reconnect...');
  setTimeout(() => process.exit(), 2000);
});
