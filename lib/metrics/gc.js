'use strict'

const { PerformanceObserver, constants } = require('perf_hooks')
const {
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB
} = constants
const Metric = require('./metric')
const {
  kRawMetric,
  kObserverCallback
} = require('../symbols')

const kUpdate = Symbol('doc.metric.gc.update')

class GCMetric extends Metric {
  static entryKindToKey (entry) {
    switch (entry.kind) {
      case NODE_PERFORMANCE_GC_MAJOR:
        return 'major'
      case NODE_PERFORMANCE_GC_MINOR:
        return 'minor'
      case NODE_PERFORMANCE_GC_INCREMENTAL:
        return 'incremental'
      case NODE_PERFORMANCE_GC_WEAKCB:
        return 'weakCB'
      default:
        return null
    }
  }

  constructor () {
    super('gc')

    this[kRawMetric] = {}
    this.reset()

    // Start listening for garbage collection events
    const gcObserver = new PerformanceObserver(this[kObserverCallback].bind(this))
    gcObserver.observe({ entryTypes: ['gc'] })
  }

  [kObserverCallback] (list) {
    for (const gcEntry of list.getEntries()) {
      this[kUpdate](gcEntry)
    }
  }

  reset () {
    // These are set as a tuple of [count; rollingAverage]
    this[kRawMetric].major = [0, 0]
    this[kRawMetric].minor = [0, 0]
    this[kRawMetric].incremental = [0, 0]
    this[kRawMetric].weakCB = [0, 0]
  }

  [kUpdate] (gcEntry) {
    const key = GCMetric.entryKindToKey(gcEntry)
    if (key) {
      let [count, average] = this[kRawMetric][key]
      if (count === 0) {
        this[kRawMetric][key] = [1, gcEntry.duration]
      } else {
        count++
        average -= average / count
        average += gcEntry.duration / count
        this[kRawMetric][key] = [count, average]
      }
    }
  }

  sample () {
    return {
      major: this[kRawMetric].major[1],
      minor: this[kRawMetric].minor[1],
      incremental: this[kRawMetric].incremental[1],
      weakCB: this[kRawMetric].weakCB[1]
    }
  }
}

module.exports = GCMetric
