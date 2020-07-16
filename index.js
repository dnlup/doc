'use strict'

const EventEmitter = require('events')
const { monitorEventLoopDelay } = require('perf_hooks')
const GCStats = require('./gc')
const validate = require('./validate')

/**
 * Convert `process.hrtime` to nanoseconds
 * @param {Array} time
 */
function hrtime2ns (time) {
  return time[0] * 1e9 + time[1]
}

/**
 * Returns the default sample interval for the collection
 */
function defaultSampleInterval () {
  return monitorEventLoopDelay ? 1000 : 500
}

/**
 * Validate Doc config options
 * @param {object} options
 * @returns {object} the validated options
 */
function config (options) {
  options.sampleInterval = options.sampleInterval || defaultSampleInterval()
  if (!validate(options)) {
    throw new Error(`${validate.errors[0].dataPath} ${validate.errors[0].message}`)
  }
  if (monitorEventLoopDelay && options.eventLoopOptions) {
    if (options.sampleInterval < options.eventLoopOptions.resolution) {
      throw new Error('.sampleInterval should be >= .eventLoopOptions.resolution')
    }
  }
  return options
}

/**
 * Doc.
 * Gahthers usage metrics of a process.
 * @param {object} options
 * @param {boolean} options.sampleInterval
 * @param {object} options.eventLoopOptions
 * @param {object} options.collect
 */
class Doc extends EventEmitter {
  constructor (options) {
    super()
    const { sampleInterval, eventLoopOptions } = config(options)

    let histogram
    if (monitorEventLoopDelay) {
      histogram = monitorEventLoopDelay(eventLoopOptions)
      histogram.enable()
    }

    const raw = {
      eventLoopDelay: 0,
      cpu: {},
      memory: {}
    }

    const gcStats = GCStats()

    let lastCheck = process.hrtime()
    let cpuUsage = process.cpuUsage()

    const timer = setInterval(() => {
      const toCheck = process.hrtime()

      let loopDelta

      raw.cpu = process.cpuUsage(cpuUsage)

      const elapsedNs = hrtime2ns(toCheck) - hrtime2ns(lastCheck)

      if (monitorEventLoopDelay) {
        raw.eventLoopDelay = histogram
        loopDelta = histogram.mean / 1e6 - eventLoopOptions.resolution
      } else {
        raw.eventLoopDelay = elapsedNs - sampleInterval * 1e6
        loopDelta = raw.eventLoopDelay / 1e6
      }

      lastCheck = toCheck
      cpuUsage = process.cpuUsage()

      this.emit('data', {
        eventLoopDelay: Math.max(0, loopDelta),
        cpu: (100 * (raw.cpu.user + raw.cpu.system)) / (elapsedNs / 1e3),
        memory: process.memoryUsage(),
        gc: gcStats.data(),
        raw
      })

      histogram && histogram.reset()
      gcStats.reset()
    }, sampleInterval)

    timer.unref()
  }
}

/**
 * Create a new Doc instance
 */
module.exports = function (options = {}) {
  return new Doc(options)
}
