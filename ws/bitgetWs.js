const WebSocket = require('ws')
const m1 = require('../collector/m1')
const m5 = require('../collector/m5')
const strategy = require('../strategy/dualTF')

const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public')

ws.on('open', () => {
  console.log('WS CONNECTED')

  ws.send(JSON.stringify({
    op: 'subscribe',
    args: [{
      instType: 'USDT-FUTURES',
      channel: 'candle1m',
      instId: 'BTCUSDT'
    }]
  }))
})

ws.on('message', (msg) => {
  const data = JSON.parse(msg)

  if (data.action === 'update' && data.data) {
    const c = data.data[0]

    const candle = {
      open: Number(c[1]),
      high: Number(c[2]),
      low: Number(c[3]),
      close: Number(c[4])
    }

    m1.pushCandle(candle)
    m5.pushFromM1(candle)

    strategy()
  }
})

module.exports = ws
