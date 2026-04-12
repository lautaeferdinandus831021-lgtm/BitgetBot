const WebSocket = require('ws');

const URL = 'wss://ws.bitget.com/mix/v1/stream';

let ws;

function connect(onPrice) {
  ws = new WebSocket(URL);

  ws.on('open', () => {
    console.log('🟢 WS CONNECTED');

    // subscribe ticker BTC
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
      const data = JSON.parse(msg);

      if (data.data && data.data[0]) {
        const price = parseFloat(data.data[0].last);
        if (price) onPrice(price);
      }

    } catch (e) {}
  });

  ws.on('close', () => {
    console.log('🔴 WS CLOSED, RECONNECT...');
    setTimeout(() => connect(onPrice), 3000);
  });

  ws.on('error', (err) => {
    console.log('❌ WS ERROR', err.message);
  });
}

module.exports = { connect };
