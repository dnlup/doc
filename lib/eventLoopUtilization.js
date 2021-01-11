'use strict'

const { eventLoopUtilization } = require('perf_hooks').performance
const {
  kRawMetric,
  kSample,
  kReset
} = require('./symbols')
const kLastSample = Symbol('kLastSample')
const { eventLoopUtilizationSupported } = require('./util')

class EventLoopUtiizationMetric {
  constructor () {
    if (!eventLoopUtilizationSupported) {
      throw new Error('eventLoopUtilization is not supported on this Node.js version')
    }
    this[kLastSample] = eventLoopUtilization()
    this[kRawMetric] = this[kLastSample]
  }

  get raw () {
    return this[kRawMetric]
  }

  [kSample] () {
    this[kRawMetric] = eventLoopUtilization(this[kLastSample])
  }

  [kReset] () {
    this[kLastSample] = eventLoopUtilization()
  }
}

module.exports = EventLoopUtiizationMetric
