'use strict'

const tap = require('tap')
const { constants } = require('perf_hooks')
const GCMetric = require('../lib/gc')
const { kObserverCallback } = require('../lib/symbols')

tap.test('garbage collection metric', t => {
  const flagsSupported = constants.NODE_PERFORMANCE_GC_FLAGS_NO !== undefined
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let expected = {
    count: data.length,
    total: data.reduce((acc, x) => acc + x, 0),
    average: data.reduce((acc, x) => acc + x, 0) / data.length
  }

  if (flagsSupported) {
    expected.flags = new Map([['no', { count: expected.count, total: expected.total }]])
  }

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => (
      flagsSupported
        ? {
          kind,
          duration: x,
          flags: constants.NODE_PERFORMANCE_GC_FLAGS_NO
        } : {
          kind, duration: x
        })
    )
  })

  const gc = new GCMetric()

  // Send in some sample data.
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc[kObserverCallback](newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  const gcStats = gc.sample()

  // Check it calculated the average correctly
  t.deepEquals(gcStats.get('major'), expected)
  t.deepEquals(gcStats.get('minor'), expected)
  t.deepEquals(gcStats.get('incremental'), expected)
  t.deepEquals(gcStats.get('weakCB'), expected)

  // Check it resets correctly
  expected = {
    count: 0,
    total: 0,
    average: 0
  }

  if (flagsSupported) {
    expected.flags = new Map()
  }

  gc.reset()
  t.deepEquals(gcStats.get('major'), expected)
  t.deepEquals(gcStats.get('minor'), expected)
  t.deepEquals(gcStats.get('incremental'), expected)
  t.deepEquals(gcStats.get('weakCB'), expected)
  t.end()
})
