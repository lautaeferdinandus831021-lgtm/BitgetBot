function tapeSignal(t){
  if(!t.length) return null;

  let b=0,s=0;

  t.forEach(x=>{
    if(x.side==='buy') b+=Number(x.size||0);
    else s+=Number(x.size||0);
  });

  if(b>s*1.5) return 'BUY';
  if(s>b*1.5) return 'SELL';

  return null;
}
module.exports={tapeSignal};
