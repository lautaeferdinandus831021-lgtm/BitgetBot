const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');
const { buildCandle, getCandles } = require('./core/candleBuilder');

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

      const result = buildCandle(price);

      // hanya jalan saat candle CLOSE
      if (result.closed) {
        const candles = getCandles();

        if (candles.length < 10) return;

        const signal = analyze(candles);

        console.log('🕯️ NEW CANDLE:', candles[candles.length - 1]);

        if (signal === 'buy') {
          console.log('🚀 BUY SIGNAL (VALID)');
        }

        if (signal === 'sell') {
          console.log('🔥 SELL SIGNAL (VALID)');
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
