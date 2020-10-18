'use strict'

module.exports = {
  kOptions: Symbol('kOptions'),
  kTimer: Symbol('kTimer'),
  kStarted: Symbol('kStarted'),
  kLastSampleTime: Symbol('kLastSampleTime'),
  kEventLoopDelay: Symbol('kEventLoopDelay'),
  kEventLoopUtilization: Symbol('kEventLoopUtilization'),
  kCpu: Symbol('kCpu'),
  kResourceUsage: Symbol('kResourceUsage'),
  kGC: Symbol('kGC'),
  kActiveHandles: Symbol('kActiveHandles'),
  kMemory: Symbol('kMemory'),
  kEmitSample: Symbol('kEmitSample'),
  kSample: Symbol('kSample'),
  kReset: Symbol('kReset'),
  kRawMetric: Symbol('kRawMetric'),
  kComputedMetric: Symbol('kComputedMetric'),
  kObserverCallback: Symbol('kObserverCallback')
}
