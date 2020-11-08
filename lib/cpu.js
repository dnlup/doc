'use strict'

const {
  kRawMetric,
  kComputedMetric,
  kSample,
  kReset
} = require('./symbols')
const kCpuLastSample = Symbol('kCpuLastSample')

class CpuMetric {
  constructor () {
    this[kCpuLastSample] = process.cpuUsage()
    this[kRawMetric] = this[kCpuLastSample]
    this[kComputedMetric] = 0
  }

  [kSample] (elapsedNs) {
    this[kRawMetric] = process.cpuUsage(this[kCpuLastSample])
    this[kComputedMetric] = 100 * ((this[kRawMetric].user + this[kRawMetric].system) / (elapsedNs / 1e3))
  }

  get usage () {
    return this[kComputedMetric]
  }

  get raw () {
    return this[kRawMetric]
  }

  [kReset] () {
    this[kCpuLastSample] = process.cpuUsage()
  }
}

module.exports = CpuMetric
