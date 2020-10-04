'use strict'

// TODO: this tests need some refactoring, it's starting to get a little messy.

const tap = require('tap')
const { monitorEventLoopDelay, performance } = require('perf_hooks')
const { eventLoopUtilization } = performance
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
  elu (t, value) {
    const level = 0
    const check = value.idle > level && value.active > 0 && value.utilization > level
    const expected = `eventLoopUtilization | {
      expected: {
        idle: ${level},
        active: ${level},
        utilization: ${level},
      },
      value: {
        idle: ${value.idle},
        active: ${value.active}
        utilization: ${value.utilization}
      }
    }`
    t.true(check, expected)
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
      const level = (nodeMajorVersion >= 12 ? 150 : 180) * 1e6
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
      const level = 10 * 15e5
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
      major: `x >= ${levels.major}`,
      minor: `x >= ${levels.minor}`,
      incremental: `x >= ${levels.incremental}`
    }

    // Not sure how to deterministically trigger a WeakCB GC cycle, so we don't check it here
    const check = value.major.average >= levels.major &&
                  value.minor.average >= levels.minor &&
                  value.incremental.average >= levels.incremental
    t.true(check, `gc |
    expected: {
      major: ${expected.major},
      minor: ${expected.minor},
      incremental: ${expected.incremental}
    },
    value: { 
      major: ${value.major.average},
      minor: ${value.minor.average},
      incremental: ${value.incremental.average}
    }`)
  },
  activeHandles (t, value) {
    const check = value > 0
    const expected = 'x > 0'
    t.true(check, `activeHandles | expected: ${expected}, value: ${value}`)
  }
}

// Since the internal timer of the Sampler instance
// is unref(ed) by default, manually schedule work on the event loop
// to avoid premature exiting from the test
function preventTestExitingEarly (t, ms) {
  const timeout = setTimeout(() => {}, ms)
  t.teardown(() => clearTimeout(timeout))
}

tap.test('sample', t => {
  const start = process.hrtime()
  const sampler = doc({
    collect: {
      gc: true,
      activeHandles: true
    }
  })

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    const end = process.hrtime(start)
    const elapsed = end[0] * 1e3 + end[1] / 1e6
    if (monitorEventLoopDelay) {
      t.true(elapsed >= 1000 && elapsed < 2000)
    } else {
      t.true(elapsed >= 500 && elapsed < 1000)
    }
    t.equal('number', typeof sampler.eventLoopDelay.computed)
    if (monitorEventLoopDelay) {
      t.equal('ELDHistogram', sampler.eventLoopDelay.raw.constructor.name)
    } else {
      t.equal('number', typeof sampler.eventLoopDelay.raw)
    }
    if (eventLoopUtilization) {
      t.equal('object', typeof sampler.eventLoopUtilization.raw)
      t.equal('number', typeof sampler.eventLoopUtilization.raw.idle)
      t.equal('number', typeof sampler.eventLoopUtilization.raw.active)
      t.equal('number', typeof sampler.eventLoopUtilization.raw.utilization)
      checks.elu(t, sampler.eventLoopUtilization.raw)
    }
    t.equal('number', typeof sampler.cpu.usage)
    t.equal('object', typeof sampler.cpu.raw)
    t.equal('number', typeof sampler.memory.rss)
    t.equal('number', typeof sampler.memory.heapTotal)
    t.equal('number', typeof sampler.memory.heapUsed)
    t.equal('number', typeof sampler.memory.external)
    checks.eventLoopDelay(t, sampler.eventLoopDelay.computed)
    checks.cpu(t, sampler.cpu.usage)
    checks.rss(t, sampler.memory.rss)
    checks.heapTotal(t, sampler.memory.heapTotal)
    checks.heapUsed(t, sampler.memory.heapUsed)
    checks.external(t, sampler.memory.external)
    checks.gc(t, sampler.gc)
    checks.activeHandles(t, sampler.activeHandles)
    t.end()
  })
})

tap.test('custom sample interval', t => {
  const start = process.hrtime()
  const sampler = doc({ sampleInterval: 2000 })
  setTimeout(() => {}, 4000)
  sampler.once('sample', () => {
    const end = process.hrtime(start)
    const elapsed = end[0] * 1e3 + end[1] / 1e6
    t.true(elapsed >= 2000 && elapsed < 2200)
    t.end()
  })
})
