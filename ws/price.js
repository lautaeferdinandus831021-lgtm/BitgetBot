const WebSocket = require('ws');

let lastPrice = 0;
let ws;
let pingInterval;

const SYMBOL = process.env.SYMBOL || 'BTCUSDT';
const WS_URL = 'wss://ws.bitget.com/v2/ws/public';

function connect() {
  ws = new WebSocket(WS_URL);

  ws.on('open', () => {
    console.log('🟢 WS Connected');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [{
        instType: "USDT-FUTURES",
        channel: "ticker",
        instId: SYMBOL
      }]
    }));

    // clear old interval
    if (pingInterval) clearInterval(pingInterval);

    // heartbeat stabil
    pingInterval = setInterval(() => {
      if (ws.readyState === 1) {
        ws.send('ping');
      }
    }, 20000);
  });

  ws.on('message', (data) => {
    try {
      if (data.toString() === 'pong') return;

      const msg = JSON.parse(data);

      if (msg.data && msg.data[0]) {
        lastPrice = parseFloat(msg.data[0].lastPr);
      }

    } catch (e) {}
  });

  ws.on('close', () => {
    console.log('🔴 WS Closed → reconnect...');
    clearInterval(pingInterval);
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
