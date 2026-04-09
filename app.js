require('dotenv').config({ path: '.env' });

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { analyze } = require('./strategy/pro');
const { updateTrailing, setPosition } = require('./risk/trailing');
const { loadHistory } = require('./core/history');
const { getBalance } = require('./core/balance');

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

  setInterval(async () => {

    if(!state.price) return;

    const signal = analyze(state);

    if(!signal) return;

    console.log("📊 SIGNAL:", signal.type);

    // ===== CEK SALDO =====
    const balance = await getBalance();
    console.log("💰 BALANCE:", balance);

    if(balance <= 0){
      console.log("⚠️ NO BALANCE → ANALISA ONLY");
      return;
    }

    // ===== PROTECTION =====
    if(lastSignal === signal.type) return;
    if(Date.now() - lastTradeTime < 10000) return;

    // ===== EXECUTE =====
    sendOrder(signal, state);
    setPosition(signal.type, state.price);

    lastSignal = signal.type;
    lastTradeTime = Date.now();

    // ===== TRAILING =====
    updateTrailing(state.price);

  }, 2000);
}

start();
