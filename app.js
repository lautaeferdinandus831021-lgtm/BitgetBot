const WebSocket = require('ws');
const { analyze } = require('./logic/signalRouter');

const ws = new WebSocket('wss://ws.bitget.com/mix/v1/stream');

ws.on('open', () => {
    console.log('✅ WS Connected');

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
    const data = JSON.parse(msg);

    if (data.data && data.data[0]) {
        const price = parseFloat(data.data[0].last);
        console.log("📈 PRICE:", price);
        analyze(price);
    }
});
