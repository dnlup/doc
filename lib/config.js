'use strict'

const { monitorEventLoopDelay } = require('perf_hooks')
const { eventLoopUtilization } = require('perf_hooks').performance
const debug = require('./debug')

const DEFAULTS = {
  sampleInterval: monitorEventLoopDelay ? 1000 : 500,
  autoStart: true,
  unref: true,
  eventLoopOptions: {
    resolution: 10
  },
  collect: {
    cpu: true,
    memory: true,
    resourceUsage: false,
    eventLoopDelay: true,
    eventLoopUtilization: !!eventLoopUtilization,
    gc: false,
    activeHandles: false
  }
}

function validate (conf) {
  if (typeof conf.sampleInterval !== 'number') {
    throw new TypeError(`sampleInterval must be a number, received ${typeof conf.sampleInterval} ${conf.sampleInterval}`)
  }

  if (conf.sampleInterval < 1) {
    throw new RangeError(`sampleInterval must be > 1, received ${conf.sampleInterval}`)
  }

  if (typeof conf.autoStart !== 'boolean') {
    throw new TypeError(`autoStart must be a boolean, received ${typeof conf.autoStart} ${conf.autoStart}`)
  }

  if (typeof conf.unref !== 'boolean') {
    throw new TypeError(`unref must be a boolean, received ${typeof conf.unref} ${conf.unref}`)
  }

  if (typeof conf.eventLoopOptions.resolution !== 'number') {
    throw new TypeError(`eventLoopOptions.resolution must be a number, received ${typeof conf.eventLoopOptions.resolution} ${conf.eventLoopOptions.resolution}`)
  }

  if (conf.eventLoopOptions.resolution < 1) {
    throw new RangeError(`eventLoopOptions.resolution must be > 1, received ${conf.eventLoopOptions.resolution}`)
  }

  if (conf.eventLoopOptions.resolution > conf.sampleInterval) {
    throw new RangeError(`eventLoopOptions.resolution must be < sampleInterval, received ${conf.eventLoopOptions.resolution}`)
  }

  for (const [key, value] of Object.entries(conf.collect)) {
    if (typeof value !== 'boolean') {
      throw new TypeError(`collect.${key} must be a boolean, received ${typeof value} ${value}`)
    }
  }

  if (conf.collect.cpu && conf.collect.resourceUsage) {
    conf.collect.cpu = false
    debug('disabling cpu metric because resourceUsage is enabled')
  }
}

function config ({ eventLoopOptions, collect, ...opts } = {}) {
  const conf = Object.assign({}, DEFAULTS, {
    ...opts,
    eventLoopOptions: Object.assign({}, DEFAULTS.eventLoopOptions, eventLoopOptions),
    collect: Object.assign({}, DEFAULTS.collect, collect)
  })
  validate(conf)
  return conf
}

module.exports = config
