'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')
const Metric = require('./metric')
const { kRawMetric } = require('../symbols')

const kEventLoopOptions = Symbol('doc.metrics.eventLoopDelay.options')

class EventLoopDelayMetric extends Metric {
  constructor (opts) {
    super('eventLoopDelay')

    this[kEventLoopOptions] = opts || {}
    if (monitorEventLoopDelay) {
      this[kRawMetric] = monitorEventLoopDelay(this[kEventLoopOptions])
      this[kRawMetric].enable()
    } else {
      this[kRawMetric] = 0
    }
  }

  sample (elapsedNs, sampleInterval) {
    if (monitorEventLoopDelay) {
      return this[kRawMetric].mean / 1e6 - this[kEventLoopOptions].resolution
    } else {
      this[kRawMetric] = Math.max(0, elapsedNs - sampleInterval * 1e6)
      return this[kRawMetric] / 1e6
    }
  }

  get raw () {
    return this[kRawMetric]
  }

  reset () {
    if (monitorEventLoopDelay) {
      this[kRawMetric].reset()
    }
  }
}

module.exports = EventLoopDelayMetric
