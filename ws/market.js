const WebSocket = require('ws');

let ws;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', ()=>{
    console.log('MARKET WS OPEN');

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [{
        instType: "UMCBL",
        channel: "ticker",
        instId: "BTCUSDT"
      }]
    }));
  });

  ws.on('message', (msg)=>{
    const data = JSON.parse(msg.toString());

    if(data.data){
      const ticker = data.data[0];
      state.price = parseFloat(ticker.last);
      console.log('PRICE:', state.price);
    }
  });

  ws.on('close', ()=>{
    console.log('MARKET RECONNECT...');
    setTimeout(()=>connectMarket(state),2000);
  });

}

module.exports = { connectMarket };
