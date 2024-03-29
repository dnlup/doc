'use strict'

const { test } = require('tap')
const { constants } = require('perf_hooks')
const {
  GCEntry,
  GCAggregatedEntry,
  GCMetric
} = require('../lib/gc')
const {
  kReset,
  kObserverCallback
} = require('../lib/symbols')

test('garbage collection metric without aggregation', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      duration: x,
      detail: {
        kind
      }
    })
    )
  })

  const gc = new GCMetric()

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  t.ok(gc.major === undefined)
  t.ok(gc.minor === undefined)
  t.ok(gc.incremental === undefined)
  t.ok(gc.weakCb === undefined)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.ok(gc.pause instanceof GCEntry)
  t.equal(gc.pause.totalCount, 4 * data.length)
  t.equal(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equal(gc.pause.max, 10002431)
  t.equal(gc.pause.min, 999936)
  t.ok(gc.pause.mean > approxMean)
  t.ok(gc.pause.getPercentile(99) > 10 * 1e6)
  t.ok(gc.pause.stdDeviation > 0)

  // Check it resets correctly
  gc[kReset]()
  t.equal(gc.pause.totalCount, 0)
  t.equal(gc.pause.totalDuration, 0)
  t.equal(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // t.equal(gc.pause.min, 0)
  t.equal(gc.pause.getPercentile(99), 0)
  t.end()
})

test('garbage collection metric with aggregation', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      duration: x,
      detail: {
        kind
      }
    })
    )
  })

  const gc = new GCMetric({
    aggregate: true
  })

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  t.ok(gc.major instanceof GCEntry)
  t.ok(gc.minor instanceof GCEntry)
  t.ok(gc.incremental instanceof GCEntry)
  t.ok(gc.weakCb instanceof GCEntry)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.ok(gc.pause instanceof GCEntry)
  t.equal(gc.pause.totalCount, 4 * data.length)
  t.equal(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equal(gc.pause.max, 10002431)
  t.equal(gc.pause.min, 999936)
  t.ok(gc.pause.mean > approxMean)
  t.ok(gc.pause.getPercentile(99) > 10 * 1e6)
  t.ok(gc.pause.stdDeviation > 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.ok(gc[entry] instanceof GCEntry, errorMessage)
    t.ok(gc[entry].mean > approxMean, errorMessage)
    t.equal(gc[entry].totalCount, data.length, errorMessage)
  }

  // Check it resets correctly
  gc[kReset]()
  t.equal(gc.pause.totalCount, 0)
  t.equal(gc.pause.totalDuration, 0)
  t.equal(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // A possible discussion to follow:
  // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
  // t.equal(gc.pause.min, 0)
  t.equal(gc.pause.getPercentile(99), 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.equal(gc[entry].mean, 0, errorMessage)
    t.equal(gc[entry].totalCount, 0, errorMessage)
    t.ok(gc[entry].flags === undefined)
  }

  t.end()
})

test('garbage collection metric with aggregation and flags', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      duration: x,
      detail: {
        kind,
        flags: constants.NODE_PERFORMANCE_GC_FLAGS_NO
      }
    })
    )
  })

  const gc = new GCMetric({
    aggregate: true,
    flags: true
  })

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  t.ok(gc.major instanceof GCAggregatedEntry)
  t.ok(gc.minor instanceof GCAggregatedEntry)
  t.ok(gc.incremental instanceof GCAggregatedEntry)
  t.ok(gc.weakCb instanceof GCAggregatedEntry)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.ok(gc.pause instanceof GCEntry)
  t.equal(gc.pause.totalCount, 4 * data.length)
  t.equal(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equal(gc.pause.max, 10002431)
  t.equal(gc.pause.min, 999936)
  t.ok(gc.pause.mean > approxMean)
  t.ok(gc.pause.getPercentile(99) > 10 * 1e6)
  t.ok(gc.pause.stdDeviation > 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.ok(gc[entry] instanceof GCAggregatedEntry, errorMessage)
    t.ok(gc[entry].mean > approxMean, errorMessage)
    t.equal(gc[entry].totalCount, data.length, errorMessage)
    t.ok(gc.major.flags.no instanceof GCEntry)
    t.ok(gc.major.flags.no.getPercentile(99) > 0)
    for (const value of [
      'mean',
      'min',
      'max',
      'stdDeviation',
      'totalCount',
      'totalDuration'
    ]) {
      const errorMessage = `Failed check for ${entry}.flags.no.${value}`
      t.ok(gc.major.flags.no[value] > 0, errorMessage)
    }

    for (const flag of [
      'constructRetained',
      'forced',
      'synchronousPhantomProcessing',
      'allAvailableGarbage',
      'allExternalMemory',
      'scheduleIdle'
    ]) {
      for (const value of [
        'mean',
        'max',
        // Not testing min value because it looks like is not initialized to zero.
        // A possible discussion to follow:
        // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
        // 'min',
        'stdDeviation',
        'totalCount',
        'totalDuration'
      ]) {
        const errorMessage = `Failed check for ${entry}.flags.${flag}.${value}`
        t.ok(gc.major.flags[flag][value] === 0, errorMessage)
      }
    }
  }

  // Check it resets correctly
  gc[kReset]()
  t.equal(gc.pause.totalCount, 0)
  t.equal(gc.pause.totalDuration, 0)
  t.equal(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // A possible discussion to follow:
  // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
  // t.equal(gc.pause.min, 0)
  t.equal(gc.pause.getPercentile(99), 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.equal(gc[entry].mean, 0, errorMessage)
    t.equal(gc[entry].totalCount, 0, errorMessage)
    t.ok(gc.major.flags.no instanceof GCEntry)
    t.equal(gc.major.flags.no.getPercentile(99), 0, errorMessage)

    for (const flag of [
      'no',
      'constructRetained',
      'forced',
      'synchronousPhantomProcessing',
      'allAvailableGarbage',
      'allExternalMemory',
      'scheduleIdle'
    ]) {
      for (const value of [
        'mean',
        'max',
        // Not testing min value because it looks like is not initialized to zero.
        // 'min',
        'stdDeviation',
        'totalCount',
        'totalDuration'
      ]) {
        const errorMessage = `Failed check for ${entry}.flags.${flag}.${value}`
        t.ok(gc.major.flags[flag][value] === 0, errorMessage)
      }
    }
  }

  t.end()
})
