const { analyze } = require('./strategy/macd'); // ganti ke macd saja

const WebSocket = require('ws');

const ws = new WebSocket("wss://ws.bitget.com/v2/ws/public");

ws.on('open', () => {
    console.log("✅ WS Connected");

    ws.send(JSON.stringify({
        op: "subscribe",
        args: [{
            instType: "mc",
            channel: "ticker",
            instId: "BTCUSDT"
        }]
    }));
});

ws.on('message', (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.data) {
        const price = data.data[0].lastPr;
        console.log("📈 PRICE:", price);

        analyze(price);
    }
});
