'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')

const {
  kRawMetric,
  kComputedMetric,
  kOptions,
  kReset,
  kSample
} = require('../symbols')

class EventLoopDelayMetric {
  constructor (opts) {
    this[kOptions] = opts || {}
    if (monitorEventLoopDelay) {
      this[kRawMetric] = monitorEventLoopDelay(this[kOptions])
      this[kRawMetric].enable()
    } else {
      this[kRawMetric] = 0
    }
  }

  get raw () {
    return this[kRawMetric]
  }

  get computed () {
    return this[kComputedMetric]
  }

  [kSample] (elapsedNs, sampleInterval) {
    if (monitorEventLoopDelay) {
      // In some cases the mean value is NaN, so I am forcing it
      // to be a float to keep V8 from deoptimizing this path.
      const value = isNaN(this[kRawMetric].mean) ? 0 : this[kRawMetric].mean
      const delta = value / 1e6 - this[kOptions].resolution
      this[kComputedMetric] = Math.max(0, delta)
    } else {
      this[kRawMetric] = elapsedNs - sampleInterval * 1e6
      this[kComputedMetric] = Math.max(0, this[kRawMetric] / 1e6)
    }
  }

  [kReset] () {
    if (monitorEventLoopDelay) {
      this[kRawMetric].reset()
    }
  }
}

module.exports = EventLoopDelayMetric
