let pb=0,pa=0;

function getDelta(b,a){
  if(!b.length || !a.length) return null;

  const bv=b.slice(0,10).reduce((s,x)=>s+Number(x[1]||0),0);
  const av=a.slice(0,10).reduce((s,x)=>s+Number(x[1]||0),0);

  const db=bv-pb;
  const da=av-pa;

  pb=bv; pa=av;

  if(db>50) return 'BUY';
  if(da>50) return 'SELL';

  return null;
}
module.exports={getDelta};
