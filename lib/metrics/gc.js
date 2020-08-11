'use strict'

const { PerformanceObserver, constants } = require('perf_hooks')
const {
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB
} = constants
const {
  kRawMetric,
  kObserverCallback
} = require('../symbols')

const kUpdate = Symbol('doc.metric.gc.update')

const GC_ENTRIES = Object.freeze({
  [NODE_PERFORMANCE_GC_MAJOR]: 'major',
  [NODE_PERFORMANCE_GC_MINOR]: 'minor',
  [NODE_PERFORMANCE_GC_INCREMENTAL]: 'incremental',
  [NODE_PERFORMANCE_GC_WEAKCB]: 'weakCB'
})

class GCMetric {
  constructor () {
    this[kRawMetric] = {
      [GC_ENTRIES[NODE_PERFORMANCE_GC_MAJOR]]: {
        count: 0,
        average: 0
      },
      [GC_ENTRIES[NODE_PERFORMANCE_GC_MINOR]]: {
        count: 0,
        average: 0
      },
      [GC_ENTRIES[NODE_PERFORMANCE_GC_INCREMENTAL]]: {
        count: 0,
        average: 0
      },
      [GC_ENTRIES[NODE_PERFORMANCE_GC_WEAKCB]]: {
        count: 0,
        average: 0
      }
    }
    this.reset()

    // Start listening for garbage collection events
    const gcObserver = new PerformanceObserver(this[kObserverCallback].bind(this))
    gcObserver.observe({ entryTypes: ['gc'], buffered: true })
  }

  [kObserverCallback] (list) {
    for (const gcEntry of list.getEntries()) {
      this[kUpdate](gcEntry)
    }
  }

  reset () {
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_MAJOR]].count = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_MAJOR]].average = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_MINOR]].count = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_MINOR]].average = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_INCREMENTAL]].count = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_INCREMENTAL]].average = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_WEAKCB]].count = 0
    this[kRawMetric][GC_ENTRIES[NODE_PERFORMANCE_GC_WEAKCB]].average = 0
  }

  [kUpdate] (gcEntry) {
    const key = GC_ENTRIES[gcEntry.kind]
    if (key) {
      let { count, average } = this[kRawMetric][key]
      if (count === 0) {
        this[kRawMetric][key].count = 1
        this[kRawMetric][key].average = gcEntry.duration
      } else {
        count++
        average -= average / count
        average += gcEntry.duration / count
        this[kRawMetric][key].count = count
        this[kRawMetric][key].average = average
      }
    }
  }

  sample () {
    return {
      major: this[kRawMetric].major.average,
      minor: this[kRawMetric].minor.average,
      incremental: this[kRawMetric].incremental.average,
      weakCB: this[kRawMetric].weakCB.average
    }
  }
}

module.exports = GCMetric
