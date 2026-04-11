const WebSocket = require('ws');
const { analyze } = require('../strategy/macdBb');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

ws.on('open', () => {
  console.log('🟢 WS Connected');

  // subscribe BTCUSDT
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

    // ambil harga dari Bitget ticker
    if (json.data && json.data[0]) {
      const price = parseFloat(json.data[0].last);

      console.log('📈 BTCUSDT PRICE:', price);

      const signal = analyze(price);

      if (signal === 'buy') {
        console.log('🚀 EXECUTE BUY');
      }

      if (signal === 'sell') {
        console.log('🔥 EXECUTE SELL');
      }
    }
  } catch (err) {
    console.log('WS PARSE ERROR:', err.message);
  }
});

ws.on('close', () => {
  console.log('🔴 WS Closed - reconnect...');
  setTimeout(() => {
    require('./index');
  }, 3000);
});

ws.on('error', (err) => {
  console.log('WS ERROR:', err.message);
});
