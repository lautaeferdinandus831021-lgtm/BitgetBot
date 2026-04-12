require('dotenv').config();
const crypto = require('crypto');

function sign(message, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('base64');
}

function getHeaders(method, path, body = '') {
    const timestamp = Date.now().toString();

    const message = timestamp + method + path + body;

    const signature = sign(message, process.env.API_SECRET);

    return {
        'ACCESS-KEY': process.env.API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        'Content-Type': 'application/json'
    };
}

module.exports = { getHeaders };
