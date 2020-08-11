'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')
const { kRawMetric } = require('../symbols')

const kEventLoopOptions = Symbol('doc.metrics.eventLoopDelay.options')

class EventLoopDelayMetric {
  constructor (opts) {
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
      // In some cases the mean value is NaN, so I am forcing it
      // to be a float to keep V8 from deoptimizing this path.
      const value = isNaN(this[kRawMetric].mean) ? 0.0 : this[kRawMetric].mean
      const delta = value / 1e6 - this[kEventLoopOptions].resolution
      return Math.max(0, delta)
    } else {
      this[kRawMetric] = elapsedNs - sampleInterval * 1e6
      return Math.max(0, this[kRawMetric] / 1e6)
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
