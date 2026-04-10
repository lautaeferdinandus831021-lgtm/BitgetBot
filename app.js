
require('dotenv').config();

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { analyze } = require('./strategy/pro');
const { updateTrailing } = require('./risk/trailing');
const { getBalance } = require('./core/balance');

let state = {
  price: 0,
  m1Closes: [],
  m5Closes: [],
  balance: 0
};

connectTrade();
connectMarket(state);

let lastSignal = null;
let lastTradeTime = 0;

// 🔥 UPDATE BALANCE TIAP 10 DETIK
setInterval(async ()=>{
  state.balance = await getBalance();
}, 10000);

setInterval(()=>{

  console.log(
    "M1:", state.m1Closes.length,
    "M5:", state.m5Closes.length,
    "Balance:", state.balance
  );

  if(state.m1Closes.length < 20) return;
  if(state.m5Closes.length < 20) return;

  const signal = analyze(state);

  if(!signal) return;

  // ❌ kalau saldo kosong → NO TRADE
  if(state.balance <= 0){
    console.log("⚠️ NO BALANCE → ANALYZE ONLY");
    return;
  }

  if(lastSignal === signal.type) return;
  if(Date.now() - lastTradeTime < 10000) return;

  console.log("📊 SIGNAL:", signal.type);

  sendOrder(signal);

  lastSignal = signal.type;
  lastTradeTime = Date.now();

  if(state.price){
    updateTrailing(state.price);
  }

}, 1000);

