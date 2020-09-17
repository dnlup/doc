'use strict'

const { createServer } = require('http')
const port = process.env.PORT || 0

function handle (req, res) {
  res.writeHead(200)
  res.end('{ "ok": true }')
}

const server = createServer(handle)
server.listen(port)
server.on('listening', () => console.log(`server listening on port ${server.address().port}`))
