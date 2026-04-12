require('dotenv').config();
const crypto = require('crypto');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const PASSPHRASE = process.env.API_PASSPHRASE;

function sign(timestamp, method, requestPath, body = '') {
    const prehash = timestamp + method + requestPath + body;

    return crypto
        .createHmac('sha256', API_SECRET)
        .update(prehash)
        .digest('base64');
}

function headers(method, requestPath, body = '') {
    const timestamp = Date.now().toString();
    const signature = sign(timestamp, method, requestPath, body);

    return {
        'ACCESS-KEY': API_KEY,
        'ACCESS-SIGN': signature,
        'ACCESS-TIMESTAMP': timestamp,
        'ACCESS-PASSPHRASE': PASSPHRASE,
        'Content-Type': 'application/json'
    };
}

module.exports = { headers };
