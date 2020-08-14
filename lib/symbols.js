'use strict'

module.exports = {
  kOptions: Symbol('doc.options'),
  kTimer: Symbol('doc.timer'),
  kLastSampleTime: Symbol('doc.lastSampleTime'),
  kEventLoopDelay: Symbol('doc.eventLoopDelay'),
  kCpu: Symbol('doc.cpu'),
  kGC: Symbol('doc.gc'),
  kData: Symbol('doc.data'),
  kEmitSample: Symbol('doc.emitSample'),
  kSample: Symbol('doc.sample'),
  kReset: Symbol('doc.reset'),
  kRawMetric: Symbol('doc.metric.raw'),
  kComputedMetric: Symbol('doc.metric.computed'),
  kObserverCallback: Symbol('doc.metric.observerCallback')
}
