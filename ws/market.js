const WebSocket = require('ws');

let ws;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

  ws.on('open', ()=>{
    console.log('MARKET CONNECT');

    ws.send(JSON.stringify({
      op:'subscribe',
      args:[
        {instType:'mc', channel:'books', instId:'BTCUSDT'},
        {instType:'mc', channel:'trade', instId:'BTCUSDT'}
      ]
    }));
  });

  ws.on('message', (msg)=>{
    try{
      const data = JSON.parse(msg);

      if(data.arg?.channel==='books'){
        const d=data.data?.[0];
        if(d){
          state.bids=d.bids||[];
          state.asks=d.asks||[];
        }
      }

      if(data.arg?.channel==='trade'){
        const t=data.data?.[0];
        if(t){
          state.trades.push({
            side:t.side,
            size:Number(t.size),
            price:Number(t.price)
          });

          if(state.trades.length>50) state.trades.shift();

          state.price = Number(t.price);
        }
      }

    }catch(e){}
  });

  ws.on('close', ()=>{
    console.log('MARKET RECONNECT...');
    setTimeout(()=>connectMarket(state),2000);
  });
}

module.exports={connectMarket};
