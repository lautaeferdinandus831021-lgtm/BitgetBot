function openPosition(type,price){
  return {
    type,
    entry:price,
    sl:type==='BUY'?price*0.997:price*1.003,
    tp:type==='BUY'?price*1.003:price*0.997
  };
}

function checkExit(price,pos){

  if(!pos) return null;

  if(pos.type==='BUY'){
    if(price>=pos.tp) return 'TP';
    if(price<=pos.sl) return 'SL';
  }

  if(pos.type==='SELL'){
    if(price<=pos.tp) return 'TP';
    if(price>=pos.sl) return 'SL';
  }

  return null;
}

module.exports={openPosition,checkExit};
