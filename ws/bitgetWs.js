import WebSocket from 'ws'
import { MARKET } from '../config/market.js'

export function startWS(onCandle) {
  const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public')

  ws.on('open', () => {
    console.log("🟢 WS CONNECTED")

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        {
          instType: MARKET.instType,
          channel: "candle1m",
          instId: MARKET.symbol
        }
      ]
    }))
  })

  ws.on('message', (msg) => {
    try {
      const res = JSON.parse(msg.toString())

      if (!res?.data) return

      const candle = res.data[res.data.length - 1]

      if (!candle) return

      onCandle(candle)

    } catch (err) {
      console.log("❌ Parse error:", err.message)
    }
  })

  ws.on('error', (err) => {
    console.log("❌ WS ERROR:", err.message)
  })
}

// DEBUG RAW
// console.log("RAW:", msg.toString())

