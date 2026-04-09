function sendOrder(signal, state){

  const price = state.price;

  let tp, sl;

  if(signal.type === "long"){
    tp = price * 1.006; // +0.6%
    sl = price * 0.997; // -0.3%
  }

  if(signal.type === "short"){
    tp = price * 0.994; // -0.6%
    sl = price * 1.003; // +0.3%
  }

  console.log("🚀 ORDER:", signal.type);
  console.log("📍 ENTRY:", price);
  console.log("🎯 TP:", tp.toFixed(2));
  console.log("🛑 SL:", sl.toFixed(2));

  // nanti bisa connect ke API Bitget di sini
}

module.exports = { sendOrder };
