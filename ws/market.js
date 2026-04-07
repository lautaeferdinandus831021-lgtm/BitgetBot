const WebSocket = require('ws');

let ws;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  state.m1Closes = [];
  state.m5Closes = [];

  ws.on('open', ()=>{
    console.log('MARKET WS OPEN');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        {
          instType: "UMCBL",
          channel: "ticker",
          instId: "BTCUSDT"
        },
        {
          instType: "UMCBL",
          channel: "candles",
          instId: "BTCUSDT",
          period: "1m"
        },
        {
          instType: "UMCBL",
          channel: "candles",
          instId: "BTCUSDT",
          period: "5m"
        }
      ]
    }));
  });

  ws.on('message', (msg)=>{
    const data = JSON.parse(msg.toString());

    if(!data.arg) return;

    const channel = data.arg.channel;

    // ===== PRICE =====
    if(channel === 'ticker' && data.data){
      state.price = parseFloat(data.data[0].last);
      console.log('PRICE:', state.price);
    }

    // ===== CANDLES =====
    if(channel === 'candles' && data.data){

      const period = data.arg.period;
      const close = parseFloat(data.data[0][4]);

      if(period === '1m'){
        state.m1Closes.push(close);
        if(state.m1Closes.length > 100) state.m1Closes.shift();
      }

      if(period === '5m'){
        state.m5Closes.push(close);
        if(state.m5Closes.length > 100) state.m5Closes.shift();
      }
    }
  });

  ws.on('close', ()=>{
    console.log('MARKET RECONNECT...');
    setTimeout(()=>connectMarket(state),2000);
  });
}

module.exports = { connectMarket };
