const WebSocket = require('ws');

function startPriceStream(pair, onUpdate) {

    const ws = new WebSocket('wss://ws.bitget.com/v2/ws/public');

    ws.on('open', () => {
        console.log("🟢 WS CONNECTED");

        ws.send(JSON.stringify({
            op: "subscribe",
            args: [{
                instType: "SPOT",
                channel: "ticker",
                instId: pair
            }]
        }));

        // heartbeat biar gak putus
        setInterval(() => {
            ws.send('ping');
        }, 20000);
    });

    ws.on('message', (msg) => {
        try {
            const json = JSON.parse(msg.toString());

            if (json.data && json.data.length > 0) {
                const price = parseFloat(json.data[0].lastPr);

                console.log("📡 PRICE:", price);

                onUpdate(price);
            }

        } catch (e) {}
    });

    ws.on('error', (err) => {
        console.log("❌ WS ERROR:", err.message);
    });

    ws.on('close', () => {
        console.log("🔁 RECONNECT...");
        setTimeout(() => startPriceStream(pair, onUpdate), 3000);
    });
}

module.exports = { startPriceStream };
