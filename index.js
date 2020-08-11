'use strict'

const EventEmitter = require('events')
const EventLoopDelayMetric = require('./lib/metrics/eventLoop')
const CpuMetric = require('./lib/metrics/cpu')
const MemoryMetric = require('./lib/metrics/memory')
const GCMetric = require('./lib/metrics/gc')
const config = require('./lib/config')
const {
  kOptions,
  kLastSampleTime,
  kMetrics,
  kEventLoop,
  kData,
  kEmitStats,
  kSample,
  kReset
} = require('./lib/symbols')

/**
 * Convert `process.hrtime` to nanoseconds
 * @param {Array} time
 */
function hrtime2ns (time) {
  return time[0] * 1e9 + time[1]
}

/**
 * Doc.
 * Gathers usage metrics of a process.
 * @param {object} options
 * @param {boolean} options.sampleInterval
 * @param {object} options.eventLoopOptions
 * @param {object} options.collect
 */
class Doc extends EventEmitter {
  constructor (options) {
    super()
    this[kOptions] = config(options)
    this[kLastSampleTime] = process.hrtime()
    this[kMetrics] = []
    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoop] = new EventLoopDelayMetric(options.eventLoopOptions)
    }
    if (this[kOptions].collect.cpu) {
      this[kMetrics].push(new CpuMetric())
    }
    if (this[kOptions].collect.memory) {
      this[kMetrics].push(new MemoryMetric())
    }
    if (this[kOptions].collect.gc) {
      this[kMetrics].push(new GCMetric())
    }

    this[kData] = {
      raw: {}
    }
    this[kSample]()
    const timer = setInterval(this[kEmitStats].bind(this), this[kOptions].sampleInterval)
    timer.unref()
  }

  [kEmitStats] () {
    this.emit('data', this[kSample]())
    this[kReset]()
  }

  [kSample] () {
    const nextSampleTime = process.hrtime()
    const elapsedNs = hrtime2ns(nextSampleTime) - hrtime2ns(this[kLastSampleTime])

    if (this[kOptions].collect.eventLoopDelay) {
      this[kData].eventLoopDelay = this[kEventLoop].sample(elapsedNs, this[kOptions].sampleInterval)
      this[kData].raw.eventLoopDelay = this[kEventLoop].raw
    }

    if (this[kOptions].collect.activeHandles) {
      this[kData].activeHandles = process._getActiveHandles().length
    }
    for (const metric of this[kMetrics]) {
      this[kData][metric.id] = metric.sample(elapsedNs, this[kOptions].sampleInterval)
      const raw = metric.raw
      if (raw !== null && raw !== undefined) {
        this[kData].raw[metric.id] = raw
      }
    }
    this[kLastSampleTime] = nextSampleTime
    return this[kData]
  }

  [kReset] () {
    if (this[kEventLoop]) {
      this[kEventLoop].reset()
    }
    for (const metric of this[kMetrics]) {
      metric.reset()
    }
  }
}

/**
 * Create a new Doc instance
 */
module.exports = function (options = {}) {
  return new Doc(options)
}
