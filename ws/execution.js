
function connectTrade(){
  console.log("🔌 Trade connected");
}

function sendOrder(signal){
  console.log("🚀 ORDER SENT:", signal.type);
}

module.exports = {
  connectTrade,
  sendOrder
};

