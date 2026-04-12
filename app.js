const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');
const { buildCandle, getCandles } = require('./core/candleBuilder');
const { buildM5 } = require('./core/m5Builder');

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

      console.log('📈 PRICE:', price);

      const result = buildCandle(price);

      if (result.closed) {
        const m1 = getCandles();

        if (m1.length < 10) return;

        const m5 = buildM5(m1);

        console.log('🕯️ M1 CLOSE:', m1[m1.length - 1]);

        if (m5) {
          console.log('📊 M5 ROLLING:', m5);
        }

        // 🔥 ANALISA MULTI TF
        const signal = analyze(m1, m5);

        if (signal === 'buy') {
          console.log('🚀 BUY SIGNAL (M1+M5 CONFIRM)');
        }

        if (signal === 'sell') {
          console.log('🔥 SELL SIGNAL (M1+M5 CONFIRM)');
        }
      }

    } catch (err) {
      console.log('❌ ERROR:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('⚠️ WS Closed → reconnect...');
    setTimeout(connect, 2000);
  });
}

connect();
