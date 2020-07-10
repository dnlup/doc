'use strict'

const tap = require('tap')
const { monitorEventLoopDelay, constants } = require('perf_hooks')
const isCi = require('is-ci')
const doc = require('./')
const GCStats = require('./gc')

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0])
const performDetailedCheck = process.platform === 'linux' || !isCi

const checks = {
  eventLoopDelay (value) {
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 1 : 20
      return value > 0 && value < level
    }
    return value >= 0
  },
  cpu (value) {
    if (performDetailedCheck) {
      return value > 0 && value < 30
    }
    // Apparently, sometimes cpu usage is zero on windows runners.
    return value >= 0
  },
  rss (value) {
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 130 : 150
      return value > 0 && value < level * 1e6
    }
    return value > 0
  },
  heapTotal (value) {
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 100 : 120
      return value > 0 && value < level * 1e6
    }
    return value > 0
  },
  heapUsed (value) {
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 80 : 100
      return value > 0 && value < level * 1e6
    }
    return value > 0
  },
  external (value) {
    if (performDetailedCheck) {
      return value > 0 && value < 10 * 1e6
    }
    return value > 0
  },
  gc (value) {
    // Not sure how to deterministically trigger a WeakCB GC cycle, so we don't check it here
    return value.major > 0 && value.minor > 0 && value.incremental > 0
  }
}

// Since the internal timer of the Doc instance
// is unref(ed), manually schedule work on the event loop
// to avoid premature exiting from the test
function preventTestExitingEarly (t, ms) {
  const timeout = setTimeout(() => {}, ms)
  t.teardown(() => clearTimeout(timeout))
}

tap.test('should throw an error if options are invalid', t => {
  let error = t.throws(() => doc({ sampleInterval: 'skdjfh' }))
  t.equal(error.message, 'sampleInterval must be a number greater than zero')
  error = t.throws(() => doc({ sampleInterval: -1 }))
  t.equal(error.message, 'sampleInterval must be a number greater than zero')
  if (monitorEventLoopDelay) {
    error = t.throws(() => doc({ sampleInterval: 5 }))
    t.equal('sampleInterval must be greather than eventLoopOptions.resolution',
      error.message)
    error = t.throws(() => doc({
      sampleInterval: 10,
      eventLoopOptions: { resolution: 20 }
    }))
    t.equal('sampleInterval must be greather than eventLoopOptions.resolution',
      error.message)
  } else {
    t.pass()
  }
  t.end()
})

tap.test('data event', t => {
  const start = process.hrtime()
  const d = doc()

  preventTestExitingEarly(t, 2000)

  d.once('data', data => {
    const end = process.hrtime(start)
    const elapsed = end[0] * 1e3 + end[1] / 1e6
    if (monitorEventLoopDelay) {
      t.true(elapsed >= 1000 && elapsed < 2000)
    } else {
      t.true(elapsed >= 500 && elapsed < 1000)
    }
    t.equal('number', typeof data.eventLoopDelay)
    t.equal('number', typeof data.cpu)
    t.equal('number', typeof data.memory.rss)
    t.equal('number', typeof data.memory.heapTotal)
    t.equal('number', typeof data.memory.heapUsed)
    t.equal('number', typeof data.memory.external)
    t.true(checks.eventLoopDelay(data.eventLoopDelay), `event loop delay check: ${data.eventLoopDelay}`)
    t.true(checks.cpu(data.cpu), `cpu check: ${data.cpu}`)
    t.true(checks.rss(data.memory.rss), `rss check: ${data.memory.rss}`)
    t.true(checks.heapTotal(data.memory.heapTotal), `heapTotal check: ${data.memory.heapTotal}`)
    t.true(checks.heapUsed(data.memory.heapUsed), `heapUsed check: ${data.memory.heapUsed}`)
    t.true(checks.external(data.memory.external), `external check: ${data.memory.external}`)
    t.end()
  })
})

// We run this in a separate test so it doesn't interfere with the expect CPU usage stats
// in the "data event" test
tap.test('garbage collection stats', t => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const expectedAverage = data.reduce((acc, x) => acc + x, 0) / data.length

  // Creates a fake list that's the same shape as PerformanceObserver
  const newFakeList = (kind) => ({
    getEntries: () => data.map(x => ({ kind, duration: x }))
  })

  const gc = GCStats()

  // Send in some sample data.
  gc.observerCallback(newFakeList(constants.NODE_PERFORMANCE_GC_MAJOR))
  gc.observerCallback(newFakeList(constants.NODE_PERFORMANCE_GC_MINOR))
  gc.observerCallback(newFakeList(constants.NODE_PERFORMANCE_GC_INCREMENTAL))
  gc.observerCallback(newFakeList(constants.NODE_PERFORMANCE_GC_WEAKCB))

  // Check it calculated the average correctly
  const gcStats = gc.data()
  t.equal(gcStats.major, expectedAverage, `gcStats.major | expected: ${expectedAverage}, value: ${gcStats.major}`)
  t.equal(gcStats.minor, expectedAverage, `gcStats.minor | expected: ${expectedAverage}, value: ${gcStats.minor}`)
  t.equal(gcStats.incremental, expectedAverage, `gcStats.incremental | expected: ${expectedAverage}, value: ${gcStats.incremental}`)
  t.equal(gcStats.weakCB, expectedAverage, `gcStats.weakCB | expected: ${expectedAverage}, value: ${gcStats.weakCB}`)

  // Check it resets correctly
  gc.reset()
  const gcStatsAfterReset = gc.data()
  t.equal(gcStatsAfterReset.major, 0, `gcStats.major after reset | expected: 0, value: ${gcStatsAfterReset.major}`)
  t.equal(gcStatsAfterReset.minor, 0, `gcStats.minor after reset | expected: 0, value: ${gcStatsAfterReset.minor}`)
  t.equal(gcStatsAfterReset.incremental, 0, `gcStats.incremental after reset | expected: 0, value: ${gcStatsAfterReset.incremental}`)
  t.equal(gcStatsAfterReset.weakCB, 0, `gcStats.weakCB after reset | expected: 0, value: ${gcStatsAfterReset.weakCB}`)

  t.end()
})

tap.test('custom sample interval', t => {
  const start = process.hrtime()
  const d = doc({ sampleInterval: 2000 })
  setTimeout(() => {}, 4000)
  d.once('data', () => {
    const end = process.hrtime(start)
    const elapsed = end[0] * 1e3 + end[1] / 1e6
    t.true(elapsed >= 2000 && elapsed < 2200)
    t.end()
  })
})
