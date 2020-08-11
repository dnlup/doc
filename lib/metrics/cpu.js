'use strict'

const { kRawMetric } = require('../symbols')

const kCpuLastSample = Symbol('doc.metrics.cpu.lastSample')

class CpuMetric {
  constructor () {
    this[kCpuLastSample] = process.cpuUsage()
    this[kRawMetric] = this[kCpuLastSample]
  }

  sample (elapsedNs) {
    this[kRawMetric] = process.cpuUsage(this[kCpuLastSample])
    return (100 * (this[kRawMetric].user + this[kRawMetric].system)) / (elapsedNs / 1e3)
  }

  get raw () {
    return this[kRawMetric]
  }

  reset () {
    this[kCpuLastSample] = process.cpuUsage()
  }
}

module.exports = CpuMetric