import WebSocket from 'ws'

const URL = 'wss://ws.bitget.com/v2/ws/public'
const SYMBOL = 'BTCUSDT'
const INST = 'USDT-FUTURES'

export function startWS(onM1, onM5) {
  const ws = new WebSocket(URL)

  ws.on('open', () => {
    console.log("🟢 WS CONNECTED")

    ws.send(JSON.stringify({
      op: "subscribe",
      args: [
        { instType: INST, channel: "candle1m", instId: SYMBOL },
        { instType: INST, channel: "candle5m", instId: SYMBOL }
      ]
    }))
  })

  ws.on('message', (msg) => {
    try {
      const res = JSON.parse(msg.toString())
      if (!res?.arg || !res?.data) return

      const channel = res.arg.channel
      const candle = res.data[res.data.length - 1]

      if (channel === "candle1m") onM1(candle)
      if (channel === "candle5m") onM5(candle)

    } catch (e) {
      console.log("❌ WS ERROR:", e.message)
    }
  })
}
