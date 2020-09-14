'use strict'

// TODO: rename symbols to reflect the fact that they apply most to the Sampler
// and follow Node.js naming convention.
module.exports = {
  kSamplerOptions: Symbol('kSamplerOptions'),
  kSamplerTimer: Symbol('kSamplerTimer'),
  kSamplerStarted: Symbol('kSamplerStarted'),
  kLastSampleTime: Symbol('kLastSampleTime'),
  kEventLoopDelay: Symbol('kEventLoopDelay'),
  kCpu: Symbol('kCpu'),
  kGC: Symbol('kGC'),
  kActiveHandles: Symbol('kActiveHandles'),
  kMemory: Symbol('kMemory'),
  kEmitSample: Symbol('kEmitSample'),
  kSample: Symbol('kSample'),
  kReset: Symbol('kReset'),
  kRawMetric: Symbol('kRawMetricaw'),
  kComputedMetric: Symbol('kComputedMetric'),
  kObserverCallback: Symbol('kObserverCallback')
}
