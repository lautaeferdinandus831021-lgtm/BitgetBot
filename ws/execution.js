require('dotenv').config();

const WebSocket = require('ws');
const crypto = require('crypto');

let ws;
let reconnectDelay = 2000;

function connectTrade(){

  ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

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

function sendOrder(signal){

  if(!ws || ws.readyState!==1) return;

  ws.send(JSON.stringify({
    op:'trade',
    args:[{
      symbol:process.env.SYMBOL,
      marginCoin:process.env.MARGIN,
      size:process.env.SIZE,
      side:signal.type==='BUY'?'open_long':'open_short',
      orderType:'market',
      clientOid:'BOT-'+Date.now()
    }]
  }));

  console.log('OPEN:', signal.type);
}

function closePosition(position){

  if(!ws || ws.readyState!==1) return;

  const side = position.type==='BUY'
    ? 'close_long'
    : 'close_short';

  ws.send(JSON.stringify({
    op:'trade',
    args:[{
      symbol:process.env.SYMBOL,
      marginCoin:process.env.MARGIN,
      size:process.env.SIZE,
      side:side,
      orderType:'market',
      clientOid:'CLOSE-'+Date.now()
    }]
  }));

  console.log('CLOSE:', side);
}

module.exports={connectTrade,sendOrder,closePosition};
