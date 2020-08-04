'use strict'

class Metric {
  constructor (name) {
    Object.defineProperty(this, 'id', {
      writable: false,
      configurable: false,
      enumerable: true,
      value: name
    })
  }

  sample (elapsedNs, sampleInterval) {}
  reset () {}
}

module.exports = Metric
