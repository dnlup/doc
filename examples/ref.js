'use strict'

const doc = require('..')

// Initialize a sampler that keeps the event loop alive
const sampler = doc({
  unref: false
})

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

process.on('SIGINT', () => {
  sampler.stop()
})
