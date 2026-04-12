const WebSocket = require('ws')

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
        { instType: 'USDT-FUTURES', channel: 'candle1m', instId: 'BTCUSDT' }
      ]
    }))
  })

  ws.on('message', (msg) => {
    const json = JSON.parse(msg)

    if (!json.data) return

    const c = json.data[0]

    const candle = {
      time: Math.floor(c[0] / 1000),
      open: +c[1],
      high: +c[2],
      low: +c[3],
      close: +c[4]
    }

    console.log('DATA:', candle.close)

    // 🔥 kirim ke semua browser
    clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(candle))
      }
    })
  })
}

module.exports = start
