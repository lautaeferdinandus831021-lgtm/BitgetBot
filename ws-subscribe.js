function subscribe(ws) {
  ws.send(JSON.stringify({
    op: "subscribe",
    args: [
      {
        instType: "mc",
        channel: "candle1m",
        instId: "BTCUSDT_UMCBL"
      },
      {
        instType: "mc",
        channel: "candle5m",
        instId: "BTCUSDT_UMCBL"
      }
    ]
  }));
}

module.exports = subscribe;
