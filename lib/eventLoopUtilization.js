'use strict'

const { eventLoopUtilization } = require('perf_hooks').performance
const {
  kRawMetric,
  kSample,
  kReset
} = require('./symbols')
const kLastSample = Symbol('kLastSample')

class EventLoopUtiizationMetric {
  constructor () {
    if (!eventLoopUtilization) {
      throw new Error('eventLoopUtilization is not supported on this Node.js version')
    }
    this[kLastSample] = eventLoopUtilization()
    this[kRawMetric] = this[kLastSample]
  }

  get utilization () {
    return this[kRawMetric].utilization
  }

  get active () {
    return this[kRawMetric].active
  }

  get idle () {
    return this[kRawMetric].idle
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
