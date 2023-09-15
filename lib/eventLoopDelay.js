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
    this[kRawMetric] = monitorEventLoopDelay(this[kOptions])
    this[kRawMetric].enable()
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
    this[kComputedMetric] = this.compute(this[kRawMetric].mean)
  }

  [kReset] () {
    if (monitorEventLoopDelay) {
      this[kRawMetric].reset()
    }
  }
}

module.exports = EventLoopDelayMetric
