require('dotenv').config();

const WebSocket = require('ws');
const crypto = require('crypto');

let ws;
let reconnectDelay = 2000;

function connectTrade(){

  ws = new WebSocket('wss://ws.bitget.com/v2/ws/private');

  ws.on('open', ()=>{
    console.log('WS OPEN');
    login();
  });

  ws.on('message', (msg)=>{
    const data = JSON.parse(msg.toString());
    console.log('WS:', data);

    if(data.event === 'login'){
      if(data.code === 0){
        console.log('LOGIN SUCCESS FROM SERVER ✅');
      }else{
        console.log('LOGIN FAILED ❌', data);
      }
    }
  });

  ws.on('error', (err)=>{
    console.log('WS ERROR:', err.message);
  });

  ws.on('close', ()=>{
    console.log('RECONNECT IN', reconnectDelay);

    setTimeout(connectTrade, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  });
}

function login(){

  const ts = Date.now().toString();

  const sign = crypto
    .createHmac('sha256', process.env.API_SECRET)
    .update(ts + 'GET' + '/user/verify')
    .digest('base64');

  ws.send(JSON.stringify({
    op:'login',
    args:[{
      apiKey:process.env.API_KEY,
      passphrase:process.env.PASSPHRASE,
      timestamp:ts,
      sign
    }]
  }));

  console.log('LOGIN SENT');
}

module.exports={connectTrade};
