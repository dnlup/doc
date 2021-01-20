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
const { gcFlagsSupported } = require('../lib/util')

test('garbage collection metric without aggregation', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      kind,
      duration: x
    })
    )
  })

  const gc = new GCMetric()

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  t.true(gc.major === undefined)
  t.true(gc.minor === undefined)
  t.true(gc.incremental === undefined)
  t.true(gc.weakCb === undefined)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.true(gc.pause instanceof GCEntry)
  t.equals(gc.pause.totalCount, 4 * data.length)
  t.equals(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equals(gc.pause.max, 10 * 1e6)
  t.equals(gc.pause.min, 1 * 1e6)
  t.true(gc.pause.mean > approxMean)
  t.true(gc.pause.getPercentile(99) > 10 * 1e6)
  t.true(typeof gc.pause.summary === 'object')
  t.true(gc.pause.stdDeviation > 0)

  // Check it resets correctly
  gc[kReset]()
  t.equals(gc.pause.totalCount, 0)
  t.equals(gc.pause.totalDuration, 0)
  t.equals(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // A possible discussion to follow:
  // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
  // t.equals(gc.pause.min, 0)
  t.equals(gc.pause.getPercentile(99), 0)
  t.end()
})

test('garbage collection metric with aggregation', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      kind,
      duration: x
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

  t.true(gc.major instanceof GCAggregatedEntry)
  t.true(gc.minor instanceof GCAggregatedEntry)
  t.true(gc.incremental instanceof GCAggregatedEntry)
  t.true(gc.weakCb instanceof GCAggregatedEntry)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.true(gc.pause instanceof GCEntry)
  t.equals(gc.pause.totalCount, 4 * data.length)
  t.equals(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equals(gc.pause.max, 10 * 1e6)
  t.equals(gc.pause.min, 1 * 1e6)
  t.true(gc.pause.mean > approxMean)
  t.true(gc.pause.getPercentile(99) > 10 * 1e6)
  t.true(typeof gc.pause.summary === 'object')
  t.true(gc.pause.stdDeviation > 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.true(gc[entry] instanceof GCAggregatedEntry, errorMessage)
    t.true(gc[entry].mean > approxMean, errorMessage)
    t.equals(gc[entry].totalCount, data.length, errorMessage)
  }

  // Check it resets correctly
  gc[kReset]()
  t.equals(gc.pause.totalCount, 0)
  t.equals(gc.pause.totalDuration, 0)
  t.equals(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // A possible discussion to follow:
  // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
  // t.equals(gc.pause.min, 0)
  t.equals(gc.pause.getPercentile(99), 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.equals(gc[entry].mean, 0, errorMessage)
    t.equals(gc[entry].totalCount, 0, errorMessage)

    for (const flag of [
      'no',
      'constructRetained',
      'forced',
      'synchronousPhantomProcessing',
      'allAvailableGarbage',
      'allExternalMemory',
      'scheduleIdle'
    ]) {
      const errorMessage = `Failed check for ${flag}`
      t.true(gc.major.flags[flag] === undefined, errorMessage)
    }
  }

  t.end()
})

test('garbage collection metric with aggregation and flags', { skip: !gcFlagsSupported }, t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({
      kind,
      duration: x,
      flags: constants.NODE_PERFORMANCE_GC_FLAGS_NO
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

  t.true(gc.major instanceof GCAggregatedEntry)
  t.true(gc.minor instanceof GCAggregatedEntry)
  t.true(gc.incremental instanceof GCAggregatedEntry)
  t.true(gc.weakCb instanceof GCAggregatedEntry)

  const entryDurationSum = data.reduce((prev, curr) => prev + curr, 0)
  const approxMean = 5 * 1e6

  t.true(gc.pause instanceof GCEntry)
  t.equals(gc.pause.totalCount, 4 * data.length)
  t.equals(gc.pause.totalDuration, 4 * entryDurationSum * 1e6)
  t.equals(gc.pause.max, 10 * 1e6)
  t.equals(gc.pause.min, 1 * 1e6)
  t.true(gc.pause.mean > approxMean)
  t.true(gc.pause.getPercentile(99) > 10 * 1e6)
  t.true(typeof gc.pause.summary === 'object')
  t.true(gc.pause.stdDeviation > 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.true(gc[entry] instanceof GCAggregatedEntry, errorMessage)
    t.true(gc[entry].mean > approxMean, errorMessage)
    t.equals(gc[entry].totalCount, data.length, errorMessage)
    t.true(gc.major.flags.no instanceof GCEntry)
    t.true(gc.major.flags.no.getPercentile(99) > 0)
    for (const value of [
      'mean',
      'min',
      'max',
      'stdDeviation',
      'totalCount',
      'totalDuration'
    ]) {
      const errorMessage = `Failed check for ${value}`
      t.true(gc.major.flags.no[value] > 0, errorMessage)
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
        const errorMessage = `Failed check for ${value}`
        t.true(gc.major.flags[flag][value] === 0, errorMessage)
      }
    }
  }

  // Check it resets correctly
  gc[kReset]()
  t.equals(gc.pause.totalCount, 0)
  t.equals(gc.pause.totalDuration, 0)
  t.equals(gc.pause.max, 0)
  // Not testing min value because it looks like is not initialized to zero.
  // A possible discussion to follow:
  // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
  // t.equals(gc.pause.min, 0)
  t.equals(gc.pause.getPercentile(99), 0)

  for (const entry of [
    'major',
    'minor',
    'incremental',
    'weakCb'
  ]) {
    const errorMessage = `Failed check for entry ${entry}`
    t.equals(gc[entry].mean, 0, errorMessage)
    t.equals(gc[entry].totalCount, 0, errorMessage)
    t.true(gc.major.flags.no instanceof GCEntry)
    t.equals(gc.major.flags.no.getPercentile(99), 0, errorMessage)

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
        // A possible discussion to follow:
        // * https://github.com/HdrHistogram/HdrHistogramJS/issues/11
        // 'min',
        'stdDeviation',
        'totalCount',
        'totalDuration'
      ]) {
        const errorMessage = `Failed check for ${value}`
        t.true(gc.major.flags[flag][value] === 0, errorMessage)
      }
    }
  }

  t.end()
})
