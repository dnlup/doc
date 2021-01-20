'use strict'

const debug = require('./debug')
const {
  monitorEventLoopDelaySupported,
  eventLoopUtilizationSupported,
  resourceUsageSupported,
  gcFlagsSupported
} = require('./util')
const { InvalidArgumentError, NotSupportedError } = require('./errors')

// This object serves as both a default config and config schema.
const DEFAULTS = {
  sampleInterval: monitorEventLoopDelaySupported ? 1000 : 500,
  autoStart: true,
  unref: true,
  // TODO: rename to eventLoopDelayOptions
  eventLoopOptions: {
    resolution: 10
  },
  gcOptions: {
    aggregate: true,
    flags: gcFlagsSupported
  },
  collect: {
    cpu: true,
    memory: true,
    resourceUsage: false,
    eventLoopDelay: true,
    eventLoopUtilization: eventLoopUtilizationSupported,
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

  if (conf.eventLoopOptions.resolution === undefined || conf.eventLoopOptions.resolution === null) {
    conf.eventLoopOptions.resolution = DEFAULTS.eventLoopOptions.resolution
  }

  if (typeof conf.eventLoopOptions.resolution !== 'number') {
    throw new InvalidArgumentError(`eventLoopOptions.resolution must be a number, received ${typeof conf.eventLoopOptions.resolution} ${conf.eventLoopOptions.resolution}`)
  }

  if (conf.eventLoopOptions.resolution < 1) {
    throw new InvalidArgumentError(`eventLoopOptions.resolution must be > 1, received ${conf.eventLoopOptions.resolution}`)
  }

  if (conf.eventLoopOptions.resolution > conf.sampleInterval) {
    throw new InvalidArgumentError(`eventLoopOptions.resolution must be < sampleInterval, received ${conf.eventLoopOptions.resolution}`)
  }

  for (const [key, value] of Object.entries(conf.collect)) {
    if (typeof value !== 'boolean') {
      throw new InvalidArgumentError(`collect.${key} must be a boolean, received ${typeof value} ${value}`)
    }
  }

  if (conf.gcOptions.flags && !gcFlagsSupported) {
    throw new NotSupportedError('GC flags are not supported on the Node.js version used')
  }

  if (conf.collect.eventLoopUtilization && !eventLoopUtilizationSupported) {
    throw new NotSupportedError('eventLoopUtilization is not supported on the Node.js version used')
  }

  if (conf.collect.resourceUsage && !resourceUsageSupported) {
    throw new NotSupportedError('resourceUsage is not supported on the Node.js version used')
  }

  if (conf.collect.cpu && conf.collect.resourceUsage) {
    conf.collect.cpu = false
    debug('disabling cpu metric because resourceUsage is enabled')
  }
}

function config ({
  eventLoopOptions,
  gcOptions,
  collect,
  ...rest
} = {}) {
  const merged = Object.assign({}, DEFAULTS, {
    ...rest,
    eventLoopOptions: Object.assign({}, DEFAULTS.eventLoopOptions, eventLoopOptions),
    gcOptions: Object.assign({}, DEFAULTS.gcOptions, gcOptions),
    collect: Object.assign({}, DEFAULTS.collect, collect)
  })

  const opts = {
    sampleInterval: merged.sampleInterval,
    autoStart: merged.autoStart,
    unref: merged.unref,
    eventLoopOptions: {
      resolution: merged.eventLoopOptions.resolution
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
