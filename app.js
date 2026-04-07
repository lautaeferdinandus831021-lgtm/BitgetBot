require('dotenv').config();

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { analyze } = require('./strategy/pro');
const { updateTrailing } = require('./risk/trailing');

let state = {
  price: 0,
  m1Closes: [],
  m5Closes: []
};

connectTrade();
connectMarket(state);

let lastSignal = null;
let lastTradeTime = 0;

setInterval(()=>{

  // 🔥 DEBUG DATA MASUK
  console.log(
    "M1:", state.m1Closes.length,
    "M5:", state.m5Closes.length
  );

  // ===== VALIDASI DATA =====
  if(!state.m1Closes || state.m1Closes.length < 10) return;
  if(!state.m5Closes || state.m5Closes.length < 10) return;

  const signal = analyze(state);

  if(signal){

    const now = Date.now();

    if(lastSignal === signal.type) return;
    if(now - lastTradeTime < 5000) return;

    console.log("SIGNAL:", signal.type);

    sendOrder(signal);

    lastSignal = signal.type;
    lastTradeTime = now;
  }

  // ===== TRAILING =====
  if(state.price){
    updateTrailing(state.price);
  }

}, 1000); // 🔥 1 DETIK
