const WebSocket = require('ws');
const { analyze } = require('../strategy/macdBb');
const { buildCandle } = require('../strategy/candleBuilder');
const { filterSignal } = require('../strategy/signalState');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

ws.on('open', () => {
  console.log('🟢 WS Connected');

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
      const price = parseFloat(json.data[0].last);

      const { closed } = buildCandle(price);

      // ❗ PENTING: hanya saat candle close
      if (!closed) return;

      console.log('🕯️ CLOSE:', closed.close);

      let signal = analyze(closed.close);

      signal = filterSignal(signal);

      if (signal === 'buy') {
        console.log('🚀 FINAL BUY');
      }

      if (signal === 'sell') {
        console.log('🔥 FINAL SELL');
      }
    }
  } catch (err) {
    console.log('WS ERROR:', err.message);
  }
});
