'use strict'

const EventEmitter = require('events')
const EventLoopDelayMetric = require('./lib/metrics/eventLoop')
const CpuMetric = require('./lib/metrics/cpu')
const GCMetric = require('./lib/metrics/gc')
const config = require('./lib/config')
const {
  kOptions,
  kLastSampleTime,
  kEventLoop,
  kCpu,
  kGC,
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

    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoop] = new EventLoopDelayMetric(options.eventLoopOptions)
    }
    if (this[kOptions].collect.cpu) {
      this[kCpu] = new CpuMetric()
    }

    if (this[kOptions].collect.gc) {
      this[kGC] = new GCMetric()
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

    if (this[kOptions].collect.cpu) {
      this[kData].cpu = this[kCpu].sample(elapsedNs)
      this[kData].raw.cpu = this[kCpu].raw
    }

    if (this[kOptions].collect.gc) {
      this[kData].gc = this[kGC].sample()
    }

    if (this[kOptions].collect.memory) {
      this[kData].memory = process.memoryUsage()
    }

    this[kLastSampleTime] = nextSampleTime
    return this[kData]
  }

  [kReset] () {
    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoop].reset()
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu].reset()
    }

    if (this[kOptions].collect.gc) {
      this[kGC].reset()
    }
  }
}

/**
 * Create a new Doc instance
 */
module.exports = function (options = {}) {
  return new Doc(options)
}
