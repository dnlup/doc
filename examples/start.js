'use strict'

const doc = require('..')

// Keep the event loop alive
const noop = () => {}
const interval = setInterval(noop, 1000)

// Initialize a sampler with the default options
const sampler = doc({
  autoStart: false
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

let counter = 0

// In this example, you need t send a SIGINT signal to start the sampler, then another SIGINT signal to exit.
process.on('SIGINT', () => {
  if (counter === 0) {
    sampler.start()
    counter++
    return
  }
  clearInterval(interval)
})
