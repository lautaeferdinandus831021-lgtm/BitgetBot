const WebSocket = require('ws');
const { analyze } = require('./strategy/macdBb');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

ws.on('open', () => {
  console.log('WS Connected');

  ws.send(JSON.stringify({
    op: "subscribe",
    args: [{
      instType: "mc",
      channel: "ticker",
      instId: "BTCUSDT"
    }]
  }));
});

ws.on('message', (msg) => {
  try {
    const json = JSON.parse(msg.toString());

    if (!json.data) return;

    const price = parseFloat(json.data[0].last);

    console.log('BTCUSDT PRICE:', price);

    const signal = analyze(price);

    if (signal === 'buy') {
      console.log('🚀 BUY SIGNAL');
    }

    if (signal === 'sell') {
      console.log('🔥 SELL SIGNAL');
    }

  } catch (e) {
    console.log('ERROR:', e.message);
  }
});
