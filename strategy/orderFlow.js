const {getDelta}=require('./delta');
const {tapeSignal}=require('./tape');
const {detectSweep}=require('./sweep');

function getOrderFlow(b,a,t,c){
  const d=getDelta(b,a);
  const tp=tapeSignal(t);
  const s=detectSweep(c);

  if(d && d===tp && tp===s) return {type:d};
  return null;
}
module.exports={getOrderFlow};
