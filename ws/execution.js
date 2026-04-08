const WebSocket = require('ws');
const crypto = require('crypto');
require('dotenv').config();

let ws;

function connectTrade(){

  // 🔥 VALIDASI ENV
  if(!process.env.API_SECRET){
    console.log("❌ ENV NOT LOADED");
    return;
  }

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/private');

  ws.on('open', ()=>{
    console.log('WS TRADE OPEN');

    const timestamp = Date.now().toString();

    const sign = crypto
      .createHmac('sha256', process.env.API_SECRET)
      .update(timestamp + 'GET' + '/user/verify')
      .digest('base64');

    ws.send(JSON.stringify({
      op: "login",
      args: [{
        apiKey: process.env.API_KEY,
        passphrase: process.env.PASSPHRASE,
        timestamp,
        sign
      }]
    }));

    console.log('LOGIN SENT');
  });

  ws.on('message', (msg)=>{
    const data = JSON.parse(msg.toString());

    if(data.event === 'login'){
      console.log('LOGIN SUCCESS FROM SERVER ✅');
    }
  });

  ws.on('close', ()=>{
    console.log('TRADE RECONNECT...');
    setTimeout(connectTrade, 2000);
  });

}

function sendOrder(signal){

  if(!ws || ws.readyState !== 1) return;

  ws.send(JSON.stringify({
    op: 'trade',
    args: [{
      symbol: process.env.SYMBOL,
      marginCoin: process.env.MARGIN,
      size: process.env.SIZE,
      side: signal.type === 'BUY' ? 'open_long' : 'open_short',
      orderType: 'market',
      clientOid: 'BOT-' + Date.now()
    }]
  }));

  console.log('OPEN:', signal.type);
}

module.exports = { connectTrade, sendOrder };
