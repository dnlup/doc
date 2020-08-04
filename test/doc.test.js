'use strict'

const tap = require('tap')
const { monitorEventLoopDelay } = require('perf_hooks')
const isCi = require('is-ci')
const doc = require('../')

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0])
const performDetailedCheck = process.platform === 'linux' || !isCi

const checks = {
  eventLoopDelay (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 1 : 20
      check = value > 0 && value < level
      expected = `0 < x < ${level}`
    } else {
      check = value >= 0
      expected = 'x >= 0'
    }
    t.true(check, `eventLoopDelay | expected: ${expected}, value: ${value}`)
  },
  cpu (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      check = value > 0 && value < 30
      expected = '0 < x < 30'
    } else {
      // Apparently, sometimes cpu usage is zero on windows runners.
      check = value >= 0
      expected = 'x >= 0'
    }
    t.true(check, `cpu | expected: ${expected}, value: ${value}`)
  },
  rss (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 130 : 150) * 1e6
      check = value > 0 && value < level
      expected = `0 < x < ${level}`
    } else {
      check = value > 0
      expected = 'x > 0'
    }
    t.true(check, `rss | expected: ${expected}, value: ${value}`)
  },
  heapTotal (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 100 : 120) * 1e6
      check = value > 0 && value < level
      expected = `0 < x < ${level}`
    } else {
      check = value > 0
      expected = 'x > 0'
    }
    t.true(check, `heapTotal | expected: ${expected}, value: ${value}`)
  },
  heapUsed (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 80 : 100) * 1e6
      check = value > 0 && value < level
      expected = `0 < x < ${level}`
    } else {
      check = value > 0
      expected = 'x > 0'
    }
    t.true(check, `heapUsed | expected: ${expected}, value: ${value}`)
  },
  external (t, value) {
    let check
    let expected
    if (performDetailedCheck) {
      const level = 10 * 11e5
      check = value > 0 && value < level
      expected = `0 < x < ${level}`
    } else {
      check = value > 0
      expected = 'x > 0'
    }
    t.true(check, `external | expected: ${expected}, value: ${value}`)
  },
  gc (t, value) {
    const levels = {
      major: 0,
      minor: 0,
      incremental: 0
    }
    const expected = {
      major: `x > ${levels.major}`,
      minor: `x > ${levels.minor}`,
      incremental: `x > ${levels.incremental}`
    }

    // Not sure how to deterministically trigger a WeakCB GC cycle, so we don't check it here
    const check = value.major > levels.major &&
                  value.minor > levels.minor &&
                  value.incremental > levels.incremental
    t.true(check, `gc |
    expected: {
      major: ${expected.major},
      minor: ${expected.minor},
      incremental: ${expected.incremental}
    },
    value: { 
      major: ${value.major},
      minor: ${value.minor},
      incremental: ${value.incremental}
    }`)
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
  t.equal(error.message, '.sampleInterval should be number')
  error = t.throws(() => doc({ sampleInterval: -1 }))
  t.equal(error.message, '.sampleInterval should be >= 1')
  if (monitorEventLoopDelay) {
    error = t.throws(() => doc({ sampleInterval: 5 }))
    t.equal('.sampleInterval should be >= .eventLoopOptions.resolution',
      error.message)
    error = t.throws(() => doc({
      sampleInterval: 10,
      eventLoopOptions: { resolution: 20 }
    }))
    t.equal('.sampleInterval should be >= .eventLoopOptions.resolution',
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
    checks.eventLoopDelay(t, data.eventLoopDelay)
    checks.cpu(t, data.cpu)
    checks.rss(t, data.memory.rss)
    checks.heapTotal(t, data.memory.heapTotal)
    checks.heapUsed(t, data.memory.heapUsed)
    checks.external(t, data.memory.external)
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
