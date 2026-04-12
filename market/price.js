const WebSocket = require('ws');

let price = null;

function startPriceStream(pair, onUpdate) {
    const ws = new WebSocket('wss://ws.bitget.com/spot/v1/stream');

    ws.on('open', () => {
        console.log("🟢 WS Connected");

        ws.send(JSON.stringify({
            op: "subscribe",
            args: [{
                instType: "SP",
                channel: "ticker",
                instId: pair
            }]
        }));
    });

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);

        if (data.data && data.data[0]) {
            price = parseFloat(data.data[0].last);
            onUpdate(price);
        }
    });

    ws.on('error', (err) => {
        console.log("WS ERROR:", err.message);
    });
}

module.exports = { startPriceStream };
