const {generateSMCSignal} = require('../strategy/smc');
const {validateM1} = require('../strategy/m1Validator');
const {getOrderFlow} = require('../strategy/orderFlow');

const {sendOrder, closePosition} = require('../ws/execution');
const {openPosition, checkExit} = require('../risk/manager');
const {updateTrailing} = require('../risk/trailing');

let position = null;
let lock = false;

function run(state){

  const {b5,b1,bids,asks,trades,price} = state;

  if(!price || b5.length<10 || b1.length<5) return;

  // EXIT
  if(position){
    position = updateTrailing(position, price);

    const exit = checkExit(price, position);

    if(exit){
      console.log('EXIT:', exit);
      closePosition(position);
      position = null;
      lock = false;
      return;
    }
  }

  if(position || lock) return;

  // ENTRY
  const trend = generateSMCSignal(b5);
  if(!trend) return;

  if(!validateM1(b1, trend.type)) return;

  const flow = getOrderFlow(bids,asks,trades,b1[b1.length-1]);
  if(!flow || flow.type !== trend.type) return;

  lock = true;

  sendOrder(trend);
  position = openPosition(trend.type, price);

  setTimeout(()=>lock=false,2000);

  console.log('ENTRY:', trend.type);
}

module.exports = { run };
