let h=0,l=999999;

function detectSweep(c){
  if(!c) return null;

  if(c.high>h && c.close<c.high) return 'SELL';
  if(c.low<l && c.close>c.low) return 'BUY';

  h=Math.max(h,c.high||0);
  l=Math.min(l,c.low||999999);

  return null;
}
module.exports={detectSweep};
