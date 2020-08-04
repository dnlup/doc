'use strict'

const tap = require('tap')
const { constants } = require('perf_hooks')
const GCMetric = require('../lib/metrics/gc')
const { kObserverCallback } = require('../lib/symbols')

tap.test('garbage collection metric', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const expectedAverage = data.reduce((acc, x) => acc + x, 0) / data.length

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({ kind, duration: x }))
  })

  const gc = new GCMetric()

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  // Check it calculated the average correctly
  const gcStats = gc.sample()
  t.equal(gcStats.major, expectedAverage, `gcStats.major | expected: ${expectedAverage}, value: ${gcStats.major}`)
  t.equal(gcStats.minor, expectedAverage, `gcStats.minor | expected: ${expectedAverage}, value: ${gcStats.minor}`)
  t.equal(gcStats.incremental, expectedAverage, `gcStats.incremental | expected: ${expectedAverage}, value: ${gcStats.incremental}`)
  t.equal(gcStats.weakCB, expectedAverage, `gcStats.weakCB | expected: ${expectedAverage}, value: ${gcStats.weakCB}`)

  // Check it resets correctly
  gc.reset()
  const gcStatsAfterReset = gc.sample()
  t.equal(gcStatsAfterReset.major, 0, `gcStats.major after reset | expected: 0, value: ${gcStatsAfterReset.major}`)
  t.equal(gcStatsAfterReset.minor, 0, `gcStats.minor after reset | expected: 0, value: ${gcStatsAfterReset.minor}`)
  t.equal(gcStatsAfterReset.incremental, 0, `gcStats.incremental after reset | expected: 0, value: ${gcStatsAfterReset.incremental}`)
  t.equal(gcStatsAfterReset.weakCB, 0, `gcStats.weakCB after reset | expected: 0, value: ${gcStatsAfterReset.weakCB}`)

  t.end()
})
