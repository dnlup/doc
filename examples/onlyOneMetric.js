'use strict'

const doc = require('..')

// Keep the event loop alive
const noop = () => {}
setInterval(noop, 1000)

// Initialize a sampler with the default options
const sampler = doc({
  collect: {
    cpu: true,
    memory: false,
    eventLoopDelay: false,
    eventLoopUtilization: false
  }
})

// On sample callback
const onSample = () => {
  console.table({
    cpu: sampler.cpu.usage
  })
}

sampler.on('sample', onSample)
