const WebSocket = require('ws');

let ws = null;
let reconnectTimeout = null;
let pingInterval = null;

function connect() {
  if (ws) {
    try { ws.close(); } catch (e) {}
  }

  console.log('🔄 Connecting WS...');

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', () => {
    console.log('✅ WS Connected');

    // Subscribe
    ws.send(JSON.stringify({
      op: 'subscribe',
      args: [
        {
          instType: 'USDT-FUTURES',
          channel: 'ticker',
          instId: 'BTCUSDT'
        }
      ]
    }));

    // Ping setiap 20 detik
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 20000);
  });

  ws.on('message', (data) => {
    try {
      const text = data.toString();

      // Handle pong
      if (text === 'pong') return;

      const msg = JSON.parse(text);

      if (msg.data && msg.data[0]) {
        const price = msg.data[0].lastPr;
        console.log('📈 PRICE:', price);
      }

    } catch (e) {
      console.log('⚠️ Parse error:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('❌ WS Disconnected');

    cleanup();
    scheduleReconnect();
  });

  ws.on('error', (err) => {
    console.log('❌ WS ERROR:', err.message);
  });
}

function scheduleReconnect() {
  if (reconnectTimeout) return;

  console.log('⏳ Reconnecting in 3s...');
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connect();
  }, 3000);
}

function cleanup() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}

module.exports = { connect };
