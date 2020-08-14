'use strict'

const { createServer } = require('http')
const Doc = require('../')

function handle (req, res) {
  res.writeHead(200)
  res.end('{ "ok": true }')
}

function base () {
  const server = createServer(handle)
  server.listen(0)
  server.on('listening', () => console.log(`server listening on port ${server.address().port}`))
}

function doc () {
  const doc = Doc({ sampleInterval: 10, collect: { gc: true, activeHandles: true } })
  // const doc = Doc({ sampleInterval: 100 })
  const server = createServer(handle)
  doc.on('sample', () => {
    const cpu = { // eslint-disable-line no-unused-vars
      usage: doc.cpu.usage,
      raw: doc.cpu.raw
    }
    const eventLoopDelay = { // eslint-disable-line no-unused-vars
      computed: doc.eventLoopDelay.computed,
      raw: doc.eventLoopDelay.raw
    }
    const gc = { // eslint-disable-line no-unused-vars
      major: doc.gc.major,
      minor: doc.gc.minor,
      incremental: doc.gc.incremental,
      weakCb: doc.gc.weakCb
    }
    const activeHandles = gc.activeHandles // eslint-disable-line no-unused-vars
  })
  server.listen(0)
  server.on('listening', () => console.error(`server listening on port ${server.address().port}`))
}

module.exports = {
  base,
  doc
}

if (require.main === module) {
  doc()
}
