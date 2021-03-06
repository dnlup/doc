'use strict'

const Sampler = require('./lib/sampler')
const util = require('./lib/util')
const errors = require('./lib/errors')

function createSampler (options = {}) {
  return new Sampler(options)
}

module.exports = createSampler
module.exports.doc = createSampler
module.exports.default = createSampler

module.exports.Sampler = Sampler
module.exports.errors = errors

Object.defineProperty(module.exports, 'eventLoopUtilizationSupported', {
  value: util.eventLoopUtilizationSupported,
  writable: false,
  enumerable: true
})

Object.defineProperty(module.exports, 'resourceUsageSupported', {
  value: util.resourceUsageSupported,
  writable: false,
  enumerable: true
})

Object.defineProperty(module.exports, 'gcFlagsSupported', {
  value: util.gcFlagsSupported,
  writable: false,
  enumerable: true
})
