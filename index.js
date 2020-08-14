'use strict'

const EventEmitter = require('events')
const EventLoopDelayMetric = require('./lib/metrics/eventLoopDelay')
const CpuMetric = require('./lib/metrics/cpu')
const GCMetric = require('./lib/metrics/gc')
const config = require('./lib/config')
const {
  kOptions,
  kTimer,
  kLastSampleTime,
  kEventLoopDelay,
  kCpu,
  kGC,
  kData,
  kEmitSample,
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
      this[kEventLoopDelay] = new EventLoopDelayMetric(options.eventLoopOptions)
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu] = new CpuMetric()
    }

    if (this[kOptions].collect.gc) {
      this[kGC] = new GCMetric()
    }

    // TODO: maybe here is better to use a Map
    this[kData] = {
      raw: {}
    }
    this[kSample]()
    this[kTimer] = setInterval(this[kEmitSample].bind(this), this[kOptions].sampleInterval)
    this[kTimer].unref()
  }

  start () {}

  stop () {
    clearTimeout(this[kTimer])
  }

  get cpu () {
    return this[kCpu]
  }

  get eventLoopDelay () {
    return this[kEventLoopDelay]
  }

  [kEmitSample] () {
    this[kSample]()
    this.emit('sample')
    this[kReset]()
  }

  [kSample] () {
    const nextSampleTime = process.hrtime()
    const elapsedNs = hrtime2ns(nextSampleTime) - hrtime2ns(this[kLastSampleTime])

    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoopDelay].sample(elapsedNs, this[kOptions].sampleInterval)
    }

    if (this[kOptions].collect.activeHandles) {
      this[kData].activeHandles = process._getActiveHandles().length
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kSample](elapsedNs)
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
      this[kEventLoopDelay].reset()
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kReset]()
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
