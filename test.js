'use strict'

const tap = require('tap')
const { monitorEventLoopDelay } = require('perf_hooks')
const isCi = require('is-ci')
const semver = require('semver')
const doc = require('./')

const performDetailedCheck = process.platform === 'linux' || !isCi
const isGte12 = semver.gte(process.versions.node, '12.0.0')

const checks = {
  eventLoopDelay (value) {
    if (performDetailedCheck) {
      const level = isGte12 ? 1 : 20
      return value > 0 && value < level
    }
    return value >= 0
  },
  cpu (value) {
    if (performDetailedCheck) {
      return value > 0 && value < 20
    }
    // Apparently, sometimes cpu usage is zero on windows runners.
    return value >= 0
  },
  rss (value) {
    if (performDetailedCheck) {
      const level = isGte12 ? 130 : 150
      return value > 0 && value < level * 1e6
    }
    return value > 0
  },
  heapTotal (value) {
    if (performDetailedCheck) {
      const level = isGte12 ? 80 : 100
      return value > 0 && value < level * 1e6
    }
    return value > 0
  },
  heapUsed (value) {
    if (performDetailedCheck) {
      const level = isGte12 ? 60 : 80
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

function doThingsWithMemory (upper) {
  const pool = []
  for (let i = 0; i < upper; ++i) {
    pool.push({ foo: { bar: { baz: i } } })
    setTimeout(() => pool.pop(), 5)
  }
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
  // Note that this is set to a large interval so we're sure garbage collection
  // occurs during the test suite
  const d = doc({ sampleInterval: 12000 })

  preventTestExitingEarly(t, 13000)

  doThingsWithMemory(1e6)
  doThingsWithMemory(1e6)
  doThingsWithMemory(1e6)

  d.once('data', data => {
    // Not sure how to deterministically trigger a WeakCB GC cycle, so we don't check it here
    t.equal('number', typeof data.gc.major)
    t.equal('number', typeof data.gc.minor)
    t.equal('number', typeof data.gc.incremental)
    t.true(checks.gc(data.gc), `gc check: ${JSON.stringify(data.gc)}`)
    t.end()
  })
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
