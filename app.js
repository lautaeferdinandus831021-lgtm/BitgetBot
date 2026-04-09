require('dotenv').config({ path: '.env' });

const { sendOrder } = require('./ws/execution'); // ❌ hapus connectTrade
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
  // ❌ connectTrade(); DIHAPUS

  setInterval(async () => {

    if(!state.price) return;

    const signal = analyze(state);

    if(!signal) return;

    console.log("📊 SIGNAL:", signal.type);

    const balance = await getBalance();
    console.log("💰 BALANCE:", balance);

    if(balance <= 0){
      console.log("⚠️ NO BALANCE → ANALISA ONLY");
      return;
    }

    if(lastSignal === signal.type) return;
    if(Date.now() - lastTradeTime < 10000) return;

    sendOrder(signal, state);
    setPosition(signal.type, state.price);

    lastSignal = signal.type;
    lastTradeTime = Date.now();

    updateTrailing(state.price);

  }, 2000);
}

start();

console.log("KEY:", process.env.API_KEY);
console.log("SECRET:", process.env.API_SECRET);
console.log("PASS:", process.env.API_PASSPHRASE);

