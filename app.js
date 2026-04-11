
require('dotenv').config();

const { connectTrade, sendOrder } = require('./ws/execution');
const { connectMarket } = require('./ws/market');
const { bollinger } = require('./strategy/bb');
const { getBalance } = require('./core/balance');

let state = {
  price: 0,
  m1Closes: [],
  m5Closes: [],
  balance: 0
};

let position = null;
let lastTradeTime = 0;

connectTrade();
connectMarket(state);

// 🔥 UPDATE BALANCE
setInterval(async ()=>{
  state.balance = await getBalance();
}, 10000);

const MIN_BALANCE = 10;
const COOLDOWN = 10000; // 10 detik

// 🔥 MAIN LOOP
setInterval(()=>{

  const price = state.price;
  const bb = bollinger(state.m5Closes, 5, 1.2);

  if(!price || !bb) return;

  console.log("💰 Balance:", state.balance, "| Price:", price);

  const now = Date.now();

  // ===== ENTRY =====
  if(!position){

    // 🚫 COOLDOWN
    if(now - lastTradeTime < COOLDOWN){
      console.log("⏱ Cooldown...");
      return;
    }

    // ❌ SALDO KOSONG
    if(state.balance < MIN_BALANCE){
      console.log("⚠️ NO BALANCE → ANALISA ONLY");

      if(price < bb.mid){
        console.log("📊 SIGNAL LONG (NO TRADE)");
      } else if(price > bb.mid){
        console.log("📊 SIGNAL SHORT (NO TRADE)");
      }

      return;
    }

    // ✅ ENTRY
    if(price < bb.mid){
      position = {
        side: "LONG",
        entry: price,
        sl: bb.lower,
        tp: bb.upper,
        size: 0.03
      };
      lastTradeTime = now;
      console.log("🟢 OPEN LONG", position);
      sendOrder({ type: "long", ...position });
    }

    else if(price > bb.mid){
      position = {
        side: "SHORT",
        entry: price,
        sl: bb.upper,
        tp: bb.lower,
        size: 0.03
      };
      lastTradeTime = now;
      console.log("🔴 OPEN SHORT", position);
      sendOrder({ type: "short", ...position });
    }

  }

  // ===== TRAILING + CLOSE =====
  if(position){

    // 🔥 TRAILING PROFIT
    if(position.side === "LONG"){
      const profit = price - position.entry;

      if(profit > 50){ // trigger trailing
        position.sl = Math.max(position.sl, price - 30);
        console.log("📈 TRAILING LONG SL:", position.sl);
      }

      if(price <= position.sl){
        console.log("❌ SL HIT LONG");
        position = null;
      }

      if(price >= position.tp){
        console.log("💰 TP HIT LONG");
        position = null;
      }
    }

    if(position.side === "SHORT"){
      const profit = position.entry - price;

      if(profit > 50){
        position.sl = Math.min(position.sl, price + 30);
        console.log("📈 TRAILING SHORT SL:", position.sl);
      }

      if(price >= position.sl){
        console.log("❌ SL HIT SHORT");
        position = null;
      }

      if(price <= position.tp){
        console.log("💰 TP HIT SHORT");
        position = null;
      }
    }

  }

}, 2000);

