const { PerformanceObserver, constants } = require('perf_hooks')
const {
  NODE_PERFORMANCE_GC_MAJOR,
  NODE_PERFORMANCE_GC_MINOR,
  NODE_PERFORMANCE_GC_INCREMENTAL,
  NODE_PERFORMANCE_GC_WEAKCB
} = constants

class GCStats {
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
    this.reset()

    // Start listening for garbage collection events
    const gcObserver = new PerformanceObserver(this.observerCallback.bind(this))
    gcObserver.observe({ entryTypes: ['gc'] })
  }

  observerCallback (list) {
    for (const gcEntry of list.getEntries()) {
      this.update(gcEntry)
    }
  }

  reset () {
    // These are set as a tuple of [count; rollingAverage]
    this.major = [0, 0]
    this.minor = [0, 0]
    this.incremental = [0, 0]
    this.weakCB = [0, 0]
  }

  update (gcEntry) {
    const key = GCStats.entryKindToKey(gcEntry)
    if (key) {
      let [count, average] = this[key]
      if (count === 0) {
        this[key] = [1, gcEntry.duration]
      } else {
        count++
        average -= average / count
        average += gcEntry.duration / count
        this[key] = [count, average]
      }
    }
  }

  data () {
    return {
      major: this.major[1],
      minor: this.minor[1],
      incremental: this.incremental[1],
      weakCB: this.weakCB[1]
    }
  }
}

module.exports = function () {
  return new GCStats()
}
