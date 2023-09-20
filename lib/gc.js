'use strict'

const { PerformanceObserver, constants, createHistogram } = require('perf_hooks')
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
  kObserverCallback,
  kStart,
  kStop
} = require('./symbols')

const kHistogram = Symbol('kHistogram')
const kTotalDuration = Symbol('kTotalDuration')

class GCEntry {
  constructor () {
    this[kHistogram] = createHistogram({
      lowestDiscernibleValue: 1
    })
    this[kTotalDuration] = 0
  }

  get totalDuration () {
    return this[kTotalDuration]
  }

  get totalCount () {
    return this[kHistogram].count
  }

  get mean () {
    return this[kHistogram].mean
  }

  get max () {
    return this[kHistogram].max
  }

  get min () {
    return this[kHistogram].min
  }

  get stdDeviation () {
    return this[kHistogram].stddev
  }

  getPercentile (percentile) {
    return this[kHistogram].percentile(percentile)
  }

  [kSample] (ns) {
    this[kTotalDuration] += ns
    /**
     * We have to truncate the value here because `record`
     * only accepts integer values:
     * https://github.com/nodejs/node/blob/cdad3d8fe5f468aec6549fd59db73a3bfe063e3c/lib/internal/histogram.js#L283-L284
     */
    this[kHistogram].record(Math.trunc(ns))
  }

  [kReset] () {
    this[kTotalDuration] = 0
    this[kHistogram].reset()
  }
}

const kFlags = Symbol('kFlags')
const kProxyFlags = Symbol('kProxyFlags')

const proxyFlagsHandler = {
  get (flags, prop) {
    switch (prop) {
      case 'no':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_NO)
      case 'constructRetained':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED)
      case 'forced':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_FORCED)
      case 'synchronousPhantomProcessing':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING)
      case 'allAvailableGarbage':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE)
      case 'allExternalMemory':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY)
      case 'scheduleIdle':
        return flags.get(NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE)
    }
  }
}

class GCAggregatedEntry extends GCEntry {
  constructor () {
    super()
    this[kFlags] = new Map([
      [NODE_PERFORMANCE_GC_FLAGS_NO, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_FORCED, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY, new GCEntry()],
      [NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE, new GCEntry()]
    ])
    this[kProxyFlags] = new Proxy(this[kFlags], proxyFlagsHandler)
  }

  get flags () {
    return this[kProxyFlags]
  }

  [kSample] (ns, gcEntry) {
    super[kSample](ns)
    const flag = gcEntry.detail.flags
    const entry = this[kFlags].get(flag)

    /* istanbul ignore next */
    if (!entry) {
      return
    }
    entry[kSample](ns)
  }

  [kReset] () {
    super[kReset]()
    for (const entry of this[kFlags].values()) {
      entry[kReset]()
    }
  }
}

const kPause = Symbol('kPause')
const kObserver = Symbol('kObserver')
const kGCEntries = Symbol('kGCEntries')

class GCMetric {
  constructor ({
    aggregate,
    flags
  } = {}) {
    this[kPause] = new GCEntry()
    if (aggregate) {
      const Entry = flags ? GCAggregatedEntry : GCEntry
      this[kGCEntries] = new Map([
        [NODE_PERFORMANCE_GC_MAJOR, new Entry(flags)],
        [NODE_PERFORMANCE_GC_MINOR, new Entry(flags)],
        [NODE_PERFORMANCE_GC_INCREMENTAL, new Entry(flags)],
        [NODE_PERFORMANCE_GC_WEAKCB, new Entry(flags)]
      ])
    } else {
      this[kGCEntries] = null
    }

    this[kObserver] = new PerformanceObserver(this[kObserverCallback].bind(this))
  }

  [kObserverCallback] (list) {
    for (const gcEntry of list.getEntries()) {
      this[kSample](gcEntry)
    }
  }

  [kStart] () {
    this[kObserver].observe({ entryTypes: ['gc'], buffered: true })
  }

  [kStop] () {
    this[kObserver].disconnect()
  }

  [kReset] () {
    this[kPause][kReset]()

    if (this[kGCEntries] === null) {
      return
    }
    for (const entry of this[kGCEntries].values()) {
      entry[kReset]()
    }
  }

  [kSample] (gcEntry) {
    const ns = gcEntry.duration * 1e6

    this[kPause][kSample](ns)

    if (this[kGCEntries] === null) {
      return
    }
    const entry = this[kGCEntries].get(gcEntry.detail.kind)
    /* istanbul ignore next */
    if (!entry) {
      return
    }
    entry[kSample](ns, gcEntry)
  }

  get pause () {
    return this[kPause]
  }

  get major () {
    if (this[kGCEntries] === null) {
      return
    }
    return this[kGCEntries].get(NODE_PERFORMANCE_GC_MAJOR)
  }

  get minor () {
    if (this[kGCEntries] === null) {
      return
    }
    return this[kGCEntries].get(NODE_PERFORMANCE_GC_MINOR)
  }

  get incremental () {
    if (this[kGCEntries] === null) {
      return
    }
    return this[kGCEntries].get(NODE_PERFORMANCE_GC_INCREMENTAL)
  }

  get weakCb () {
    if (this[kGCEntries] === null) {
      return
    }
    return this[kGCEntries].get(NODE_PERFORMANCE_GC_WEAKCB)
  }
}

module.exports = {
  GCEntry,
  GCAggregatedEntry,
  GCMetric
}
