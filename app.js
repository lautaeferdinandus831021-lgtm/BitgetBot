require('dotenv').config();

const {run} = require('./core/engine');
const {connectTrade} = require('./ws/execution');
const {connectMarket} = require('./ws/market');

let state = {
  b5: [],
  b1: [],
  bids: [],
  asks: [],
  trades: [],
  price: 0
};

connectTrade();
connectMarket(state);

setInterval(()=>{
  run(state);
}, 50);
