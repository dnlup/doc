'use strict'

const doc = require('..')

// Keep the event loop alive
const noop = () => {}
setInterval(noop, 1000)

// Initialize a sampler with the default options
const sampler = doc({
  gcOptions: {
    aggregate: true,
    flags: false
  },
  collect: {
    gc: true
  }
})

// On sample callback
const onSample = () => {
  console.table({
    cpu: sampler.cpu.usage,
    ...sampler.memory,
    eventLoopDelay: sampler.eventLoopDelay.computed,
    eventLoopUtilization: doc.eventLoopUtilizationSupported ? sampler.eventLoopUtilization.utilization : 'Not Supported',
    gc: sampler.gc.pause.mean,
    'gc(99)': sampler.gc.pause.getPercentile(99),
    'gc.minor': sampler.gc.minor.mean,
    'gc.minor(99)': sampler.gc.minor.getPercentile(99)
  })
}

sampler.on('sample', onSample)
