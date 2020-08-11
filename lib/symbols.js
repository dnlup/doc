'use strict'

module.exports = {
  kOptions: Symbol('doc.options'),
  kLastSampleTime: Symbol('doc.lastSampleTime'),
  kEventLoop: Symbol('doc.eventLoop'),
  kCpu: Symbol('doc.cpu'),
  kGC: Symbol('doc.gc'),
  kData: Symbol('doc.data'),
  kEmitStats: Symbol('doc.emitStats'),
  kSample: Symbol('doc.sample'),
  kReset: Symbol('doc.reset'),
  kRawMetric: Symbol('doc.metric.raw'),
  kObserverCallback: Symbol('doc.metric.observerCallback')
}
