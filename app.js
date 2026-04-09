require('dotenv').config({ path: '.env' });

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { analyze } = require('./strategy/pro');
const { updateTrailing } = require('./risk/trailing');
const { loadHistory } = require('./core/history');

const state = {
  price: 0,
  m1Closes: [],
  m5Closes: []
};

let lastSignal = null;
let lastTradeTime = 0;

async function start(){

  console.log("📦 LOAD HISTORY...");
  await loadHistory(state);

  connectMarket(state);
  connectTrade();

  setInterval(() => {

    if(!state.price) return;

    const signal = analyze(state);

    // ===== PROTECTION =====
    if(!signal) return;
    if(lastSignal === signal.type) return;
    if(Date.now() - lastTradeTime < 10000) return;

    console.log("SIGNAL:", signal.type);

    sendOrder(signal, state);

    lastSignal = signal.type;
    lastTradeTime = Date.now();

    // ===== TRAILING =====
    if(state.price){
      updateTrailing(state.price);
    }

  }, 1000);
}

start();
