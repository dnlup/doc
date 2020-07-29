'use strict'

const Metric = require('./metric')

class MemoryMetric extends Metric {
  constructor () {
    super('memory')
  }

  sample () {
    return process.memoryUsage()
  }
}

module.exports = MemoryMetric
