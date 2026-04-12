#!/bin/bash

echo "🚀 Creating BitgetBot structure..."

# Root files
touch app.js package.json

# Config
mkdir -p config
touch config/env.js
touch config/market.js

# WebSocket
mkdir -p ws
touch ws/bitgetWs.js

# Strategy
mkdir -p strategy
touch strategy/singleTF.js
touch strategy/dualTF.js

# Indicators
mkdir -p indicators/ema
mkdir -p indicators/rsi

touch indicators/ema/ema.js
touch indicators/rsi/rsi.js
touch indicators/index.js

# Utils
mkdir -p utils
touch utils/candleBuilder.js

echo "✅ Structure created successfully!"
