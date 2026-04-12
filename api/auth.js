const crypto = require('crypto')

function sign(timestamp, method, path, body, secret) {
  const str = timestamp + method + path + body
  return crypto.createHmac('sha256', secret).update(str).digest('base64')
}

module.exports = { sign }
