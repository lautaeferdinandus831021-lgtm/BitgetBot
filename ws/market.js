const WebSocket = require('ws');

let ws;
let pingInterval;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

  ws.on('open', ()=>{
    console.log('📡 MARKET CONNECT');

    // 🔥 FIX instType + channel
    ws.send(JSON.stringify({
      op:'subscribe',
      args:[
        {instType:'UMCBL', channel:'books', instId:'BTCUSDT'},
        {instType:'UMCBL', channel:'trade', instId:'BTCUSDT'},
        {instType:'UMCBL', channel:'candle1m', instId:'BTCUSDT'},
        {instType:'UMCBL', channel:'candle5m', instId:'BTCUSDT'}
      ]
    }));

    // 🔥 KEEP ALIVE
    pingInterval = setInterval(()=>{
      if(ws.readyState === 1){
        ws.send('ping');
      }
    }, 20000);
  });

  ws.on('message', (msg)=>{
    try{

      if(msg.toString() === 'pong') return;

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
          state.price=Number(t.price);

          state.trades.push({
            side:t.side,
            size:Number(t.size),
            price:Number(t.price)
          });

          if(state.trades.length>50) state.trades.shift();
        }
      }

      if(data.arg?.channel==='candle1m'){
        const c=data.data?.[0];
        if(c){
          state.b1.push({
            open:Number(c[1]),
            high:Number(c[2]),
            low:Number(c[3]),
            close:Number(c[4])
          });

          if(state.b1.length>100) state.b1.shift();
        }
      }

      if(data.arg?.channel==='candle5m'){
        const c=data.data?.[0];
        if(c){
          state.b5.push({
            open:Number(c[1]),
            high:Number(c[2]),
            low:Number(c[3]),
            close:Number(c[4])
          });

          if(state.b5.length>100) state.b5.shift();
        }
      }

    }catch(e){}
  });

  ws.on('close', ()=>{
    console.log('❌ MARKET RECONNECT...');
    clearInterval(pingInterval);
    setTimeout(()=>connectMarket(state),3000);
  });

  ws.on('error', (e)=>{
    console.log('WS ERROR', e.message);
  });
}

module.exports = { connectMarket };
