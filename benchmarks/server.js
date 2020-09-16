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

function withDoc () {
  const port = process.env.PORT || 0
  const sampler = Doc({ sampleInterval: 10, collect: { gc: true, activeHandles: true } })
  const server = createServer(handle)
  /* eslint-disable no-unused-vars */
  sampler.on('sample', () => {
    const cpu = {
      usage: sampler.cpu.usage,
      raw: sampler.cpu.raw
    }
    const eventLoopDelay = {
      computed: sampler.eventLoopDelay.computed,
      raw: sampler.eventLoopDelay.raw
    }
    const memory = sampler.memory
    const gc = {
      major: sampler.gc.major,
      minor: sampler.gc.minor,
      incremental: sampler.gc.incremental,
      weakCb: sampler.gc.weakCb
    }
    const activeHandles = gc.activeHandles
    /* eslint-enable no-unused-vars */
  })
  server.listen(port)
  server.on('listening', () => console.error(`server listening on port ${server.address().port}`))
}

module.exports = {
  base,
  withDoc
}

if (require.main === module) {
  withDoc()
}
