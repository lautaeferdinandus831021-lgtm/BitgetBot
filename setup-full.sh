#!/bin/bash

echo "🚀 Creating FULL BitgetBot..."

# ========================
# package.json
# ========================
cat << 'PKG' > package.json
{
  "name": "bitget-bot",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "dependencies": {
    "ws": "^8.13.0",
    "dotenv": "^16.4.5"
  }
}
PKG

# ========================
# CONFIG
# ========================
mkdir -p config

cat << 'ENV' > config/env.js
import dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
  MODE: process.env.MODE || "DUAL", // SINGLE / DUAL
}
ENV

cat << 'MARKET' > config/market.js
export const MARKET = {
  instType: "USDT-FUTURE",
  symbol: "BTCUSDT"
}
MARKET

# ========================
# WS
# ========================
mkdir -p ws

cat << 'WS' > ws/bitgetWs.js
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
    const res = JSON.parse(msg.toString())

    if (res?.data) {
      onCandle(res.data)
    }
  })

  ws.on('error', (err) => {
    console.log("❌ WS ERROR:", err.message)
  })
}
WS

# ========================
# INDICATORS
# ========================
mkdir -p indicators/ema
mkdir -p indicators/rsi

cat << 'EMA' > indicators/ema/ema.js
export function EMA(data, period = 9) {
  const k = 2 / (period + 1)
  let ema = data[0]

  return data.map(price => {
    ema = price * k + ema * (1 - k)
    return ema
  })
}
EMA

cat << 'RSI' > indicators/rsi/rsi.js
export function RSI(data, period = 14) {
  let gains = 0
  let losses = 0

  for (let i = data.length - period; i < data.length - 1; i++) {
    const diff = data[i + 1] - data[i]
    if (diff >= 0) gains += diff
    else losses -= diff
  }

  const rs = gains / (losses || 1)
  return 100 - (100 / (1 + rs))
}
RSI

cat << 'INDEX' > indicators/index.js
export * from './ema/ema.js'
export * from './rsi/rsi.js'
INDEX

# ========================
# UTILS
# ========================
mkdir -p utils

cat << 'CANDLE' > utils/candleBuilder.js
let buffer = []

export function build5m(candle1m) {
  buffer.push(candle1m)

  if (buffer.length === 5) {
    const open = buffer[0][1]
    const close = buffer[4][4]
    const high = Math.max(...buffer.map(c => c[2]))
    const low = Math.min(...buffer.map(c => c[3]))

    buffer = []

    return [Date.now(), open, high, low, close]
  }

  return null
}
CANDLE

# ========================
# STRATEGY
# ========================
mkdir -p strategy

cat << 'SINGLE' > strategy/singleTF.js
export function singleTFStrategy(price) {
  if (price > 70000) return "BUY"
  if (price < 69000) return "SELL"
  return null
}
SINGLE

cat << 'DUAL' > strategy/dualTF.js
import { EMA, RSI } from '../indicators/index.js'

let trend = null

export function updateTrend(price1m, history) {
  const ema = EMA(history, 9).slice(-1)[0]

  if (price1m > ema) trend = "UP"
  else trend = "DOWN"
}

export function dualTFStrategy(price5m, history) {
  const rsi = RSI(history, 14)

  if (trend === "UP" && rsi > 50) return "BUY"
  if (trend === "DOWN" && rsi < 50) return "SELL"

  return null
}
DUAL

# ========================
# APP
# ========================
cat << 'APP' > app.js
import { startWS } from './ws/bitgetWs.js'
import { build5m } from './utils/candleBuilder.js'
import { CONFIG } from './config/env.js'

import { singleTFStrategy } from './strategy/singleTF.js'
import { dualTFStrategy, updateTrend } from './strategy/dualTF.js'

let history1m = []
let history5m = []

console.log("🚀 BOT STARTED MODE:", CONFIG.MODE)

startWS((candles) => {

  const last = candles[candles.length - 1]
  const price = parseFloat(last[4])

  history1m.push(price)
  if (history1m.length > 100) history1m.shift()

  console.log("📈 1M PRICE:", price)

  if (CONFIG.MODE === "SINGLE") {
    const signal = singleTFStrategy(price)
    console.log("SIGNAL:", signal)
  }

  if (CONFIG.MODE === "DUAL") {
    updateTrend(price, history1m)

    const candle5m = build5m(last)

    if (candle5m) {
      const price5m = parseFloat(candle5m[4])

      history5m.push(price5m)
      if (history5m.length > 100) history5m.shift()

      console.log("🕯️ 5M PRICE:", price5m)

      const signal = dualTFStrategy(price5m, history5m)

      console.log("🔥 SIGNAL:", signal)
    }
  }
})
APP

echo "✅ FULL BOT READY!"
