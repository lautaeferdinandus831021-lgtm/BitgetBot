const WebSocket = require('ws');

let ws;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', ()=>{
    console.log('MARKET WS OPEN');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        {
          instType: "UMCBL",
          channel: "candle1m",
          instId: "BTCUSDT"
        }
      ]
    }));
  });

  ws.on('message', (msg)=>{
    const data = JSON.parse(msg.toString());

    if(data.data){
      const candle = data.data[0];

      // FORMAT BITGET:
      // [timestamp, open, high, low, close, volume]

      const close = parseFloat(candle[4]);

      // ===== M1 =====
      state.m1Closes.push(close);
      if(state.m1Closes.length > 100){
        state.m1Closes.shift();
      }

      // ===== M5 (AGGREGATE) =====
      if(state.m1Closes.length % 5 === 0){
        state.m5Closes.push(close);
        if(state.m5Closes.length > 100){
          state.m5Closes.shift();
        }
      }

      state.price = close;

      console.log("CLOSE:", close);
    }
  });

  ws.on('close', ()=>{
    console.log('MARKET RECONNECT...');
    setTimeout(()=>connectMarket(state),2000);
  });
}

module.exports = { connectMarket };
