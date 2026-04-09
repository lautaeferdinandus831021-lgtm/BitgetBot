const WebSocket = require('ws');

let bufferM1 = [];

function connectMarket(state){

  const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', () => {
    console.log('📡 MARKET WS OPEN');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        {
          instType: "USDT-FUTURES",
          channel: "candle1m",
          instId: "BTCUSDT"
        }
      ]
    }));
  });

  ws.on('message', (msg) => {
    try{
      const data = JSON.parse(msg);

      if(data.action === 'update' && data.data){

        const candle = data.data[0];
        const close = parseFloat(candle[4]);

        state.price = close;

        // ===== M1 =====
        state.m1Closes.push(close);
        if(state.m1Closes.length > 100){
          state.m1Closes.shift();
        }

        // ===== BUILD M5 =====
        bufferM1.push(close);

        if(bufferM1.length === 5){
          const m5Close = bufferM1[4];

          state.m5Closes.push(m5Close);

          if(state.m5Closes.length > 100){
            state.m5Closes.shift();
          }

          console.log("🟡 M5 NEW:", m5Close);

          bufferM1 = [];
        }

        console.log("📊 PRICE:", close);
      }

    }catch(e){
      console.log("WS ERROR", e.message);
    }
  });

  ws.on('close', () => {
    console.log("❌ WS CLOSED, RECONNECT...");
    setTimeout(()=> connectMarket(state), 2000);
  });
}

module.exports = { connectMarket };
