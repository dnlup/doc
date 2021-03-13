'use strict'

const EventEmitter = require('events')
const EventLoopDelayMetric = require('./eventLoopDelay')
const EventLoopUtilizationMetric = require('./eventLoopUtilization')
const CpuMetric = require('./cpu')
const ResourceUsageMetric = require('./resourceUsage')
const { GCMetric } = require('./gc')
const config = require('./config')
const { hrtime2ns } = require('@dnlup/hrtime-utils')
const {
  kOptions,
  kTimer,
  kStarted,
  kLastSampleTime,
  kEventLoopDelay,
  kEventLoopUtilization,
  kCpu,
  kResourceUsage,
  kGC,
  kActiveHandles,
  kMemory,
  kEmitSample,
  kSample,
  kReset,
  kStart,
  kStop
} = require('./symbols')

class Sampler extends EventEmitter {
  constructor (options) {
    super()
    this[kOptions] = config(options)
    this[kLastSampleTime] = process.hrtime()

    if (this[kOptions].collect.eventLoopDelay) {
      this[kEventLoopDelay] = new EventLoopDelayMetric(this[kOptions].eventLoopDelayOptions)
    }

    if (this[kOptions].collect.eventLoopUtilization) {
      this[kEventLoopUtilization] = new EventLoopUtilizationMetric()
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu] = new CpuMetric()
    }

    if (this[kOptions].collect.resourceUsage) {
      this[kResourceUsage] = new ResourceUsageMetric()
    }

    if (this[kOptions].collect.gc) {
      this[kGC] = new GCMetric(this[kOptions].gcOptions)
    }

    this[kSample]()
    if (this[kOptions].autoStart) {
      this.start()
    }
  }

  start () {
    if (this[kStarted]) return
    if (this[kOptions].collect.gc) {
      this[kGC][kStart]()
    }
    this[kTimer] = setInterval(this[kEmitSample].bind(this), this[kOptions].sampleInterval)
    if (this[kOptions].unref) {
      this[kTimer].unref()
    }
    this[kStarted] = true
  }

  stop () {
    clearInterval(this[kTimer])
    this[kStarted] = false
    this[kReset]()
    if (this[kOptions].collect.gc) {
      this[kGC][kStop]()
    }
  }

  get cpu () {
    return this[kCpu]
  }

  get resourceUsage () {
    return this[kResourceUsage]
  }

  get eventLoopDelay () {
    return this[kEventLoopDelay]
  }

  get eventLoopUtilization () {
    return this[kEventLoopUtilization]
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

    if (this[kOptions].collect.eventLoopUtilization) {
      this[kEventLoopUtilization][kSample]()
    }

    if (this[kOptions].collect.activeHandles) {
      this[kActiveHandles] = process._getActiveHandles().length
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kSample](elapsedNs)
    }

    if (this[kOptions].collect.resourceUsage) {
      this[kResourceUsage][kSample](elapsedNs)
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

    if (this[kOptions].collect.eventLoopUtilization) {
      this[kEventLoopUtilization][kReset]()
    }

    if (this[kOptions].collect.cpu) {
      this[kCpu][kReset]()
    }

    if (this[kOptions].collect.resourceUsage) {
      this[kResourceUsage][kReset]()
    }

    if (this[kOptions].collect.gc) {
      this[kGC][kReset]()
    }
  }
}

module.exports = Sampler
