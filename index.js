'use strict'

const Sampler = require('./lib/sampler')

function createSampler (options = {}) {
  return new Sampler(options)
}

module.exports = createSampler
module.exports.Sampler = Sampler
