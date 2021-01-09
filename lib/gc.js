'use strict'

const { PerformanceObserver, constants } = require('perf_hooks')
const {
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB,
  NODE_PERFORMANCE_GC_FLAGS_NO,
  NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED,
  NODE_PERFORMANCE_GC_FLAGS_FORCED,
  NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING,
  NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE,
  NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY,
  NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE
} = constants
const {
  kSample,
  kReset,
  kComputedMetric,
  kObserverCallback
} = require('./symbols')

const { gcFlagsSupported } = require('./util')

const GC_ENTRIES = Object.freeze({
  [NODE_PERFORMANCE_GC_MAJOR]: 'major',
  [NODE_PERFORMANCE_GC_MINOR]: 'minor',
  [NODE_PERFORMANCE_GC_INCREMENTAL]: 'incremental',
  [NODE_PERFORMANCE_GC_WEAKCB]: 'weakCb'
})

const GC_FLAGS = Object.freeze({
  [NODE_PERFORMANCE_GC_FLAGS_NO]: 'no',
  [NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED]: 'constructRetained',
  [NODE_PERFORMANCE_GC_FLAGS_FORCED]: 'forced',
  [NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING]: 'synchronousPhantomProcessing',
  [NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE]: 'allAvailableGarbage',
  [NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY]: 'allExternalMemory',
  [NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE]: 'scheduleIdle'
})

class GCAggregatedEntry {
  constructor () {
    this.count = 0
    this.total = 0
    this.average = 0
    if (gcFlagsSupported) {
      this.flags = new Map()
    }
  }

  [kSample] (gcEntry) {
    if (this.count === 0) {
      this.count = 1
      this.average = gcEntry.duration
    } else {
      this.count++
      this.average -= this.average / this.count
      this.average += gcEntry.duration / this.count
    }

    this.total += gcEntry.duration

    if (gcFlagsSupported) {
      const flags = GC_FLAGS[gcEntry.flags]
      if (flags) {
        if (this.flags.has(flags)) {
          const stat = this.flags.get(flags)
          stat.count += 1
          stat.total += gcEntry.duration
        } else {
          this.flags.set(flags, {
            count: 1,
            total: gcEntry.duration
          })
        }
      }
    }
  }

  [kReset] () {
    this.count = 0
    this.total = 0
    this.average = 0
    if (gcFlagsSupported) {
      for (const entry of this.flags.keys()) {
        this.flags.delete(entry)
      }
    }
  }
}

class GCMetric {
  constructor () {
    this[kComputedMetric] = new Map([
      [GC_ENTRIES[NODE_PERFORMANCE_GC_MAJOR], new GCAggregatedEntry()],
      [GC_ENTRIES[NODE_PERFORMANCE_GC_MINOR], new GCAggregatedEntry()],
      [GC_ENTRIES[NODE_PERFORMANCE_GC_INCREMENTAL], new GCAggregatedEntry()],
      [GC_ENTRIES[NODE_PERFORMANCE_GC_WEAKCB], new GCAggregatedEntry()]
    ])

    // Start listening for garbage collection events
    const gcObserver = new PerformanceObserver(this[kObserverCallback].bind(this))
    gcObserver.observe({ entryTypes: ['gc'], buffered: true })
  }

  [kObserverCallback] (list) {
    for (const gcEntry of list.getEntries()) {
      this[kSample](gcEntry)
    }
  }

  [kReset] () {
    for (const entry of this[kComputedMetric].values()) {
      entry[kReset]()
    }
  }

  [kSample] (gcEntry) {
    const key = GC_ENTRIES[gcEntry.kind]
    if (key) {
      this[kComputedMetric].get(key)[kSample](gcEntry)
    }
  }

  get major () {
    return this[kComputedMetric].get('major')
  }

  get minor () {
    return this[kComputedMetric].get('minor')
  }

  get incremental () {
    return this[kComputedMetric].get('incremental')
  }

  get weakCb () {
    return this[kComputedMetric].get('weakCb')
  }
}

module.exports = GCMetric
