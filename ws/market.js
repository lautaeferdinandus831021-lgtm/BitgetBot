const WebSocket = require('ws');

let ws;

function connectMarket(state){

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

  ws.on('open', ()=>{
    console.log('MARKET WS OPEN');

    // M1
    ws.send(JSON.stringify({
      op: "subscribe",
      args: [{
        instType: "UMCBL",
        channel: "candle1m",
        instId: "BTCUSDT"
      }]
    }));

    // M5
    ws.send(JSON.stringify({
      op: "subscribe",
      args: [{
        instType: "UMCBL",
        channel: "candle5m",
        instId: "BTCUSDT"
      }]
    }));

  });

  ws.on('message', (msg)=>{
    const json = JSON.parse(msg.toString());

    // DEBUG 🔥 lihat struktur asli
    // console.log(JSON.stringify(json));

    if(!json.data || !json.arg) return;

    const channel = json.arg.channel;

    json.data.forEach(c => {

      let close;

      // FORMAT ARRAY
      if(Array.isArray(c)){
        close = parseFloat(c[4]);
      }

      // FORMAT OBJECT
      else if(c.close){
        close = parseFloat(c.close);
      }

      if(!close) return;

      if(channel === "candle1m"){
        state.m1Closes.push(close);
        if(state.m1Closes.length > 200) state.m1Closes.shift();
      }

      if(channel === "candle5m"){
        state.m5Closes.push(close);
        if(state.m5Closes.length > 200) state.m5Closes.shift();
      }

    });

  });

  ws.on('close', ()=>{
    console.log('MARKET RECONNECT...');
    setTimeout(()=>connectMarket(state),2000);
  });

  ws.on('error', (err)=>{
    console.log('WS ERROR:', err.message);
  });

}

module.exports = { connectMarket };
