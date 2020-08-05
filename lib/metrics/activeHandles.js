'use strict'

const Metric = require('./metric')

class ActiveHandlesMetric extends Metric {
  constructor () {
    super('activeHandles')
  }

  sample (elapsedNs, sampleInterval) {
    return process._getActiveHandles().length
  }
}

module.exports = ActiveHandlesMetric
