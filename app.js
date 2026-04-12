require('dotenv').config();

const { connect } = require('./core/ws');
const { buildCandle } = require('./strategy/candleBuilder');
const { analyze } = require('./strategy/macd');
const { openHedge, resolve } = require('./strategy/hedge');
const { getBalance } = require('./core/api');

let mode = 'ANALYZE';

// ===== MODE =====
async function updateMode() {
  const bal = await getBalance().catch(()=>0);

  if (!bal || bal < 50) mode = 'ANALYZE';
  else mode = 'TRADE';

  console.log('💰 MODE:', mode, 'BAL:', bal);
}
setInterval(updateMode, 10000);

// ===== MAIN FLOW =====
connect(async (price) => {
  // realtime tick masuk sini
  const { closed } = buildCandle(price);
  if (!closed) return;

  const signal = analyze(closed.close);
  if (!signal) return;

  console.log('📊 SIGNAL:', signal, 'PRICE:', closed.close);

  if (mode === 'TRADE') {
    await openHedge(closed.close);
    await resolve(signal);
  }
});

console.log('🚀 BOT LIVE (REALTIME WS)');
