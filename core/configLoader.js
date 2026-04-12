const fs = require('fs');

function loadConfig() {
    const raw = fs.readFileSync('./config/user.json');
    return JSON.parse(raw);
}

module.exports = { loadConfig };
