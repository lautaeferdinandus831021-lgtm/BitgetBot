const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const m1 = require('./collector/m1')
const m5 = require('./collector/m5')
const macd = require('./indicators/macd')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// 🔥 BITGET WS
const bitget = new WebSocket('wss://ws.bitget.com/mix/v1/stream')

bitget.on('open', () => {
  console.log('BITGET CONNECTED')

  bitget.send(JSON.stringify({
    op: 'subscribe',
    args: [{
      instType: 'mc',
      channel: 'ticker',
      instId: 'BTCUSDT'
    }]
  }))
})

bitget.on('message', (msg) => {
  try {
    const json = JSON.parse(msg)

    if (!json.data) return

    const price = parseFloat(json.data[0].last)
    if (!price) return

    const c1 = m1(price)
    const c5 = m5(c1)
    const macdData = macd(price)

    const payload = {
      m1: c1,
      m5: c5,
      macd: macdData
    }

    console.log('DATA:', price)

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload))
      }
    })

  } catch (e) {
    console.log('ERROR', e.message)
  }
})

// 🔥 PORT 8000
server.listen(8000, '0.0.0.0', () => {
  console.log('SERVER RUNNING http://0.0.0.0:8000')
})
