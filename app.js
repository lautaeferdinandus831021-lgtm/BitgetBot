
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

connectTrade();
connectMarket(state);

// 🔥 UPDATE BALANCE TIAP 10 DETIK
setInterval(async ()=>{
  state.balance = await getBalance();
}, 10000);

// 🔥 MIN BALANCE
const MIN_BALANCE = 10;

// 🔥 MAIN LOOP
setInterval(()=>{

  const price = state.price;
  const bb = bollinger(state.m5Closes, 5, 1.2);

  if(!price || !bb) return;

  console.log(
    "💰 Balance:", state.balance,
    "| Price:", price
  );

  // ===== ENTRY =====
  if(!position){

    // ❌ SALDO TIDAK CUKUP
    if(state.balance < MIN_BALANCE){
      console.log("⚠️ NO BALANCE → ANALISA ONLY");

      if(price < bb.mid){
        console.log("📊 SIGNAL LONG (NO TRADE)");
      } else if(price > bb.mid){
        console.log("📊 SIGNAL SHORT (NO TRADE)");
      }

      return;
    }

    // ✅ ENTRY REAL
    if(price < bb.mid){
      position = {
        side: "LONG",
        entry: price,
        sl: bb.lower,
        tp: bb.upper,
        size: 0.03
      };
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
      console.log("🔴 OPEN SHORT", position);
      sendOrder({ type: "short", ...position });
    }

  }

  // ===== CLOSE =====
  if(position){

    if(position.side === "LONG"){

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

