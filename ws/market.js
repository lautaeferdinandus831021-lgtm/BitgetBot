const WebSocket = require('ws');

function connectMarket(state) {
  const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', () => {
    console.log('📡 MARKET CONNECT');

    // Subscribe candle M1 + M5
    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        {
          instType: "USDT-FUTURES",
          channel: "candle1m",
          instId: "BTCUSDT"
        },
        {
          instType: "USDT-FUTURES",
          channel: "candle5m",
          instId: "BTCUSDT"
        }
      ]
    }));
  });

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());

      // Ping response
      if (data.event === "ping") {
        ws.send(JSON.stringify({ event: "pong" }));
        return;
      }

      if (!data.arg) return;

      const channel = data.arg.channel;
      const c = data.data?.[0];

      if (!c) return;

      const candle = {
        open: Number(c[1]),
        high: Number(c[2]),
        low: Number(c[3]),
        close: Number(c[4])
      };

      if (channel === "candle1m") {
        state.m1 = candle;
      }

      if (channel === "candle5m") {
        state.m5 = candle;
      }

    } catch (e) {
      console.log("PARSE ERROR", e.message);
    }
  });

  ws.on('close', () => {
    console.log('❌ MARKET RECONNECT...');
    setTimeout(() => connectMarket(state), 2000);
  });

  ws.on('error', (e) => {
    console.log('WS ERROR:', e.message);
  });
}

module.exports = { connectMarket };
