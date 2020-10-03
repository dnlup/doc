'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')

const {
  kRawMetric,
  kComputedMetric,
  kOptions,
  kReset,
  kSample
} = require('./symbols')

const DEFAULTS = {
  resolution: 10
}

class EventLoopDelayMetric {
  constructor (opts) {
    this[kOptions] = Object.assign({}, DEFAULTS, opts)
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

  compute (raw) {
    // In some cases the mean value is NaN because
    // there are not enough samples.
    const value = isNaN(raw) ? 0 : raw
    const delta = value / 1e6 - this[kOptions].resolution
    return Math.max(0, delta)
  }

  [kSample] (elapsedNs, sampleInterval) {
    if (monitorEventLoopDelay) {
      this[kComputedMetric] = this.compute(this[kRawMetric].mean)
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
