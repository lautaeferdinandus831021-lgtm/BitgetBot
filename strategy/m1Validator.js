function validateM1(c,d){
  if(!c.length) return false;

  const l=c.slice(-5);
  let b=0,s=0;

  l.forEach(x=>{
    if((x.close||0) > (x.open||0)) b++;
    else s++;
  });

  if(d==='BUY' && b>=3) return true;
  if(d==='SELL' && s>=3) return true;

  return false;
}
module.exports={validateM1};
