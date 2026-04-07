function updateTrailing(pos,price){

  if(!pos) return pos;

  if(pos.type==='BUY' && price>pos.entry*1.002){
    pos.sl=price*0.998;
  }

  if(pos.type==='SELL' && price<pos.entry*0.998){
    pos.sl=price*1.002;
  }

  return pos;
}

module.exports={updateTrailing};
