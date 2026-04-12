const WebSocket = require('ws')
const m1 = require('../collector/m1')
const m5 = require('../collector/m5')

let clients = []

function start(server) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('CLIENT CONNECT')
    clients.push(ws)
  })

  const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public')

  ws.on('open', () => {
    console.log('WS CONNECTED')

    ws.send(JSON.stringify({
      op: 'subscribe',
      args: [
        { instType: 'USDT-FUTURES', channel: 'candle1m', instId: 'BTCUSDT' },
        { instType: 'USDT-FUTURES', channel: 'candle5m', instId: 'BTCUSDT' }
      ]
    }))
  })

  ws.on('message', (msg) => {
    const json = JSON.parse(msg)

    if (!json.data) return

    const c = json.data[0]
    const channel = json.arg.channel

    const isClosed = c[6] === '1'
    if (!isClosed) return

    const candle = {
      time: Math.floor(c[0] / 1000),
      open: +c[1],
      high: +c[2],
      low: +c[3],
      close: +c[4]
    }

    console.log('DATA:', channel, candle.close)

    if (channel === 'candle1m') m1.add(candle)
    if (channel === 'candle5m') m5.add(candle)

    clients.forEach(cws => {
      cws.send(JSON.stringify(candle))
    })
  })
}

module.exports = start
