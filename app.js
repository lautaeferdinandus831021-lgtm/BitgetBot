require('dotenv').config();

const { server, broadcast } = require('./server');
const { buildCandle } = require('./strategy/candleBuilder');
const { filterSignal } = require('./strategy/signalState');

server.listen(3000, () => {
  console.log('🌐 Web running: http://0.0.0.0:3000');
});

// dummy price (ganti WS nanti)
setInterval(() => {
  const price = 72800 + Math.random() * 200;

  const { closed } = buildCandle(price);
  if (!closed) return;

  broadcast({
    candle: {
      time: Math.floor(Date.now()/1000),
      open: closed.open,
      high: closed.high,
      low: closed.low,
      close: closed.close
    }
  });

}, 1000);
