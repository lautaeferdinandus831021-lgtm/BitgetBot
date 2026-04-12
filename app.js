require('dotenv').config();

const { runStrategy } = require('./strategy/scalping');

async function main() {
  console.log('🚀 BOT START');

  setInterval(async () => {
    await runStrategy();
  }, 5000);
}

main();
