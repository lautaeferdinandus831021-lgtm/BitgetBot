require('dotenv').config();

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { analyze } = require('./strategy/pro');

// ===== STATE GLOBAL =====
let state = {
  price: 0,
  m1Closes: [],
  m5Closes: []
};

// ===== CONNECT WS =====
connectTrade();
connectMarket(state);

// ===== TRAILING FUNCTION =====
let positions = [];

function updateTrailing(price){

  positions.forEach(pos => {

    if(pos.type === 'BUY'){
      if(price > pos.entry){
        pos.trailing = Math.max(pos.trailing || 0, price - pos.entry);
      }

      if(price < pos.entry + (pos.trailing * 0.5)){
        console.log('TRAIL CLOSE BUY');
      }
    }

    if(pos.type === 'SELL'){
      if(price < pos.entry){
        pos.trailing = Math.max(pos.trailing || 0, pos.entry - price);
      }

      if(price > pos.entry - (pos.trailing * 0.5)){
        console.log('TRAIL CLOSE SELL');
      }
    }

  });

}

// ===== MAIN LOOP =====
let lastSignal = null;
let lastTradeTime = 0;

setInterval(()=>{

  // ===== VALIDASI DATA =====
  if(!state.m1Closes || state.m1Closes.length < 10) return;
  if(!state.m5Closes || state.m5Closes.length < 10) return;

  const signal = analyze(state);

  if(signal){

    const now = Date.now();

    // ❌ hindari spam arah sama
    if(lastSignal === signal.type) return;

    // ⚠️ delay 5 detik
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
