const WebSocket = require('ws');
const crypto = require('crypto');
require('dotenv').config();

let ws;

function connectTrade(){

  ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

  ws.on('open', ()=> login());

  ws.on('close', ()=>{
    console.log('TRADE RECONNECT...');
    setTimeout(connectTrade,2000);
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

  console.log('LOGIN OK');
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
