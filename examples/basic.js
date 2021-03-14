'use strict'

const doc = require('..')

// Keep the event loop alive
const noop = () => {}
setInterval(noop, 1000)

// Initialize a sampler with the default options
const sampler = doc()

// On sample callback
const onSample = () => {
  console.table({
    cpu: sampler.cpu.usage,
    ...sampler.memory,
    eventLoopDelay: sampler.eventLoopDelay.computed,
    eventLoopUtilization: doc.eventLoopUtilizationSupported ? sampler.eventLoopUtilization.utilization : 'Not Supported'
  })
}

sampler.on('sample', onSample)
