'use strict'

const Sampler = require('./lib/sampler')
const errors = require('./lib/errors')

function createSampler (options = {}) {
  return new Sampler(options)
}

module.exports = createSampler
module.exports.doc = createSampler
module.exports.default = createSampler

module.exports.Sampler = Sampler
module.exports.errors = errors
