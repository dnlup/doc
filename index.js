'use strict'

const EventEmitter = require('events')
const { monitorEventLoopDelay } = require('perf_hooks')
const GCStats = require('./gc')

function hrtime2ns (time) {
  return time[0] * 1e9 + time[1]
}

function defaultSampleInterval () {
  return monitorEventLoopDelay ? 1000 : 500
}

function validate ({
  sampleInterval = defaultSampleInterval(),
  eventLoopOptions = { resolution: 10 }
} = {}) {
  if (typeof sampleInterval !== 'number' || sampleInterval < 0) {
    throw new Error('sampleInterval must be a number greater than zero')
  }
  if (monitorEventLoopDelay && eventLoopOptions) {
    if (sampleInterval < eventLoopOptions.resolution) {
      throw new Error('sampleInterval must be greather than eventLoopOptions.resolution')
    }
  }

  return {
    sampleInterval,
    eventLoopOptions
  }
}

class Doc extends EventEmitter {
  constructor (options) {
    super()

    const { sampleInterval, eventLoopOptions } = validate(options)

    // Currently `monitorEventLoopDelay` is available only on Node 12.
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

module.exports = function (options) {
  return new Doc(options)
}
