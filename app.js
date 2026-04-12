const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');

let ws;

function connect() {
  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', () => {
    console.log('✅ WS Connected');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [{
        instType: "USDT-FUTURES",
        channel: "ticker",
        instId: "BTCUSDT"
      }]
    }));
  });

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      if (!data.data) return;

      const ticker = data.data[0];

      if (!ticker.lastPr) return;

      const price = parseFloat(ticker.lastPr);

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

  ws.on('close', () => {
    console.log('⚠️ WS Closed → reconnect...');
    setTimeout(connect, 2000);
  });

  ws.on('error', (err) => {
    console.log('❌ WS Error:', err.message);
  });
}

connect();
