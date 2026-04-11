const WebSocket = require('ws');

function connect() {
  const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

  ws.on('open', () => {
    console.log('🔌 WS Connected');

    ws.send(JSON.stringify({
      op: 'subscribe',
      args: [{
        instType: 'mc',
        channel: 'ticker',
        instId: 'BTCUSDT'
      }]
    }));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.data && msg.data[0]) {
        const price = msg.data[0].last;
        console.log('📈 PRICE:', price);
      }
    } catch (e) {}
  });

  ws.on('close', () => {
    console.log('❌ WS disconnected, reconnecting...');
    setTimeout(connect, 3000);
  });

  ws.on('error', (err) => {
    console.log('❌ WS ERROR:', err.message);
  });
}

module.exports = { connect };
