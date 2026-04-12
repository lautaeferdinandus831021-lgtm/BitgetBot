const http = require('http')
const fs = require('fs')
const path = require('path')
const startWS = require('./ws/bitgetWs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const file = fs.readFileSync(path.join(__dirname, 'public/chart.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(file)
  }
})

startWS(server)

server.listen(3000, () => {
  console.log('🚀 Server running http://localhost:3000')
})
