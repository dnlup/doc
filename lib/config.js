'use strict'

const debug = require('./debug')
const { InvalidArgumentError } = require('./errors')

// This object serves as both a default config and config schema.
const DEFAULTS = {
  sampleInterval: 1000,
  autoStart: true,
  unref: true,
  eventLoopDelayOptions: {
    resolution: 10
  },
  gcOptions: {
    aggregate: false,
    flags: true
  },
  collect: {
    cpu: true,
    memory: true,
    resourceUsage: false,
    eventLoopDelay: true,
    eventLoopUtilization: true,
    gc: false,
    activeHandles: false
  }
}

function validate (conf) {
  if (conf.sampleInterval === undefined || conf.sampleInterval === null) {
    conf.sampleInterval = DEFAULTS.sampleInterval
  }

  if (typeof conf.sampleInterval !== 'number') {
    throw new InvalidArgumentError(`sampleInterval must be a number, received ${typeof conf.sampleInterval} ${conf.sampleInterval}`)
  }

  if (conf.sampleInterval < 1) {
    throw new InvalidArgumentError(`sampleInterval must be > 1, received ${conf.sampleInterval}`)
  }

  if (typeof conf.autoStart !== 'boolean') {
    throw new InvalidArgumentError(`autoStart must be a boolean, received ${typeof conf.autoStart} ${conf.autoStart}`)
  }

  if (typeof conf.unref !== 'boolean') {
    throw new InvalidArgumentError(`unref must be a boolean, received ${typeof conf.unref} ${conf.unref}`)
  }

  for (const [key, value] of Object.entries(conf.gcOptions)) {
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError(`gcOptions.${key} must be a boolean, received ${typeof value} ${value}`)
    }
  }

  if (conf.eventLoopDelayOptions.resolution === undefined || conf.eventLoopDelayOptions.resolution === null) {
    conf.eventLoopDelayOptions.resolution = DEFAULTS.eventLoopDelayOptions.resolution
  }

  if (typeof conf.eventLoopDelayOptions.resolution !== 'number') {
    throw new InvalidArgumentError(`eventLoopDelayOptions.resolution must be a number, received ${typeof conf.eventLoopDelayOptions.resolution} ${conf.eventLoopDelayOptions.resolution}`)
  }

  if (conf.eventLoopDelayOptions.resolution < 1) {
    throw new InvalidArgumentError(`eventLoopDelayOptions.resolution must be > 1, received ${conf.eventLoopDelayOptions.resolution}`)
  }

  if (conf.eventLoopDelayOptions.resolution > conf.sampleInterval) {
    throw new InvalidArgumentError(`eventLoopDelayOptions.resolution must be < sampleInterval, received ${conf.eventLoopDelayOptions.resolution}`)
  }

  for (const [key, value] of Object.entries(conf.collect)) {
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError(`collect.${key} must be a boolean, received ${typeof value} ${value}`)
    }
  }

  if (conf.collect.cpu && conf.collect.resourceUsage) {
    conf.collect.cpu = false
    debug('disabling cpu metric because resourceUsage is enabled')
  }
}

function config ({
  eventLoopDelayOptions,
  gcOptions,
  collect,
  ...rest
} = {}) {
  const merged = Object.assign({}, DEFAULTS, {
    ...rest,
    eventLoopDelayOptions: Object.assign({}, DEFAULTS.eventLoopDelayOptions, eventLoopDelayOptions),
    gcOptions: Object.assign({}, DEFAULTS.gcOptions, gcOptions),
    collect: Object.assign({}, DEFAULTS.collect, collect)
  })

  const opts = {
    sampleInterval: merged.sampleInterval,
    autoStart: merged.autoStart,
    unref: merged.unref,
    eventLoopDelayOptions: {
      resolution: merged.eventLoopDelayOptions.resolution
    },
    gcOptions: {
      aggregate: merged.gcOptions.aggregate,
      flags: merged.gcOptions.flags
    },
    collect: {
      cpu: merged.collect.cpu,
      memory: merged.collect.memory,
      resourceUsage: merged.collect.resourceUsage,
      eventLoopDelay: merged.collect.eventLoopDelay,
      eventLoopUtilization: merged.collect.eventLoopUtilization,
      gc: merged.collect.gc,
      activeHandles: merged.collect.activeHandles
    }
  }
  validate(opts)
  return opts
}

module.exports = config
