const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(express.static(__dirname)); // serve chart.html

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
});

function broadcast(data) {
  clients.forEach(c => c.send(JSON.stringify(data)));
}

module.exports = { server, broadcast };
