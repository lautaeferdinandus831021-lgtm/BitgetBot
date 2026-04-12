require('dotenv').config();

const { run } = require('./strategy/scalping');

setInterval(async () => {
  await run();
}, 5000);
