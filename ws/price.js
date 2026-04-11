const WebSocket = require('ws');

let lastPrice = 0;

const SYMBOL = process.env.SYMBOL || 'BTCUSDT';
const WS_URL = 'wss://ws.bitget.com/mix/v1/stream';

function connect() {
  const ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log('🔌 WS Connected');

    ws.send(JSON.stringify({
      op: 'subscribe',
      args: [{
        instType: 'mc',
        channel: 'ticker',
        instId: SYMBOL
      }]
    }));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.data && msg.data[0]) {
        lastPrice = parseFloat(msg.data[0].last);
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    console.log('❌ WS Closed → reconnect...');
    setTimeout(connect, 3000);
  });

  ws.on('error', () => {
    ws.close();
  });
}

function getPrice() {
  return lastPrice;
}

connect();

module.exports = { getPrice };
