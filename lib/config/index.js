'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')
const validate = require('./validate')

function defaultSampleInterval () {
  return monitorEventLoopDelay ? 1000 : 500
}

function config (options) {
  options.sampleInterval = options.sampleInterval || defaultSampleInterval()
  if (!validate(options)) {
    throw new Error(`${validate.errors[0].dataPath} ${validate.errors[0].message}`)
  }
  if (monitorEventLoopDelay && options.eventLoopOptions) {
    if (options.sampleInterval < options.eventLoopOptions.resolution) {
      throw new Error('.sampleInterval should be >= .eventLoopOptions.resolution')
    }
  }
  return options
}

module.exports = config
