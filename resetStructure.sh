rm -rf modules logs data backtest ai

mkdir -p modules/{market,indicator,strategy/singleTF,strategy/dualTF,strategy/multiTF,logic,risk,order,exchange/spot,exchange/futures,account}
mkdir -p data/{candles,cache}
mkdir -p logs
mkdir -p backtest
mkdir -p ai
mkdir -p config
mkdir -p core
mkdir -p utils

echo "🔥 Clean structure ready"
