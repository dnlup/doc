'use strict'

const { createServer } = require('http')
const { eventLoopUtilization } = require('perf_hooks').performance
const doc = require('../')

function handle (req, res) {
  res.writeHead(200)
  res.end('{ "ok": true }')
}

const port = process.env.PORT || 0
const sampler = doc({
  sampleInterval: 50,
  gcOptions: {
    aggregate: true
  },
  collect: {
    resourceUsage: true,
    gc: true,
    activeHandles: true
  }
})

const server = createServer(handle)
/* eslint-disable no-unused-vars */
sampler.on('sample', () => {
  const cpu = {
    usage: sampler.resourceUsage.cpu,
    raw: sampler.resourceUsage.raw
  }
  const eventLoopDelay = {
    computed: sampler.eventLoopDelay.computed,
    raw: sampler.eventLoopDelay.raw
  }
  if (eventLoopUtilization) {
    const eventLoopUtilization = sampler.eventLoopUtilization.raw
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
