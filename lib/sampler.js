'use strict'

const EventEmitter = require('events')
const EventLoopDelayMetric = require('./eventLoopDelay')
const CpuMetric = require('./cpu')
const GCMetric = require('./gc')
const config = require('./config')
const {
  kOptions,
  kTimer,
  kStarted,
  kLastSampleTime,
  kEventLoopDelay,
  kCpu,
  kGC,
  kActiveHandles,
  kMemory,
  kEmitSample,
  kSample,
  kReset
} = require('./symbols')

function hrtime2ns (time) {
  return time[0] * 1e9 + time[1]
}

class Sampler extends EventEmitter {
  constructor (options) {
    super()
    this[kOptions] = config(options)
    this[kLastSampleTime] = process.hrtime()

    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoopDelay] = new EventLoopDelayMetric(this[kOptions].eventLoopOptions)
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu] = new CpuMetric()
    }

    if (this[kOptions].collect.gc) {
      this[kGC] = new GCMetric()
    }

    this[kSample]()
    if (this[kOptions].autoStart) {
      this.start()
    }
  }

  start () {
    if (this[kStarted]) return
    this[kTimer] = setInterval(this[kEmitSample].bind(this), this[kOptions].sampleInterval)
    if (this[kOptions].unref) {
      this[kTimer].unref()
    }
    this[kStarted] = true
  }

  stop () {
    clearInterval(this[kTimer])
    this[kStarted] = false
  }

  get cpu () {
    return this[kCpu]
  }

  get eventLoopDelay () {
    return this[kEventLoopDelay]
  }

  get gc () {
    return this[kGC]
  }

  get activeHandles () {
    return this[kActiveHandles]
  }

  get memory () {
    return this[kMemory]
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
      this[kEventLoopDelay][kSample](elapsedNs, this[kOptions].sampleInterval)
    }

    if (this[kOptions].collect.activeHandles) {
      this[kActiveHandles] = process._getActiveHandles().length
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kSample](elapsedNs)
    }

    if (this[kOptions].collect.memory) {
      this[kMemory] = process.memoryUsage()
    }

    this[kLastSampleTime] = nextSampleTime
  }

  [kReset] () {
    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoopDelay][kReset]()
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kReset]()
    }

    if (this[kOptions].collect.gc) {
      this[kGC][kReset]()
    }
  }
}

module.exports = Sampler
