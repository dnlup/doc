'use strict'

const Metric = require('./metric')
const { kRawMetric } = require('../symbols')

const kCpuLastSample = Symbol('doc.metrics.cpu.lastSample')

class CpuMetric extends Metric {
  constructor () {
    super('cpu')
    this[kCpuLastSample] = process.cpuUsage()
    this[kRawMetric] = this[kCpuLastSample]
  }

  sample (elapsedNs, sampleInterval) {
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
