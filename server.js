const WebSocket = require('ws')
const http = require('http')
const express = require('express')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Simpan client frontend
let clients = []

wss.on('connection', (ws) => {
    clients.push(ws)

    ws.on('close', () => {
        clients = clients.filter(c => c !== ws)
    })
})

// CONNECT BITGET
const bitget = new WebSocket('wss://ws.bitget.com/mix/v1/stream')

bitget.on('open', () => {
    console.log('WS CONNECTED')

    bitget.send(JSON.stringify({
        op: "subscribe",
        args: [{
            instType: "mc",
            channel: "ticker",
            instId: "BTCUSDT"
        }]
    }))
})

let lastPrice = null

bitget.on('message', (msg) => {
    try {
        const data = JSON.parse(msg)

        if (data.data && data.data[0]) {
            const price = parseFloat(data.data[0].last)

            // anti spam (hanya kirim jika berubah)
            if (price !== lastPrice) {
                lastPrice = price

                // kirim ke semua client frontend
                clients.forEach(ws => {
                    ws.send(JSON.stringify({
                        price,
                        time: Date.now()
                    }))
                })
            }
        }

    } catch (e) {}
})

server.listen(3000, () => {
    console.log('🚀 SERVER RUNNING http://localhost:3000')
})
