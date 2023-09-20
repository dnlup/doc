'use strict'

const {
  kRawMetric,
  kComputedMetric,
  kSample,
  kReset
} = require('./symbols')

const kLastSample = Symbol('kLastSample')

class ResourceUsageMetric {
  constructor () {
    this[kLastSample] = process.resourceUsage()
    this[kRawMetric] = this[kLastSample]
    this[kComputedMetric] = 0
  }

  get cpu () {
    return this[kComputedMetric]
  }

  [kSample] (elapsedNs) {
    this[kRawMetric] = process.resourceUsage()
    const cpu = {
      user: this[kRawMetric].userCPUTime - this[kLastSample].userCPUTime,
      system: this[kRawMetric].systemCPUTime - this[kLastSample].systemCPUTime
    }
    this[kComputedMetric] = 100 * ((cpu.user + cpu.system) / (elapsedNs / 1e3))
  }

  get raw () {
    return this[kRawMetric]
  }

  [kReset] () {
    this[kLastSample] = process.resourceUsage()
  }
}

module.exports = ResourceUsageMetric
