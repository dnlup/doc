'use strict'

const { test } = require('tap')
const { monitorEventLoopDelay } = require('perf_hooks')
const isCi = require('is-ci')
const { hrtime2ms } = require('@dnlup/hrtime-utils')
const doc = require('../')
const { kOptions } = require('../lib/symbols')

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0])
const performDetailedCheck = process.platform === 'linux' || !isCi

// Since the internal timer of the Sampler instance
// is unref(ed) by default, manually schedule work on the event loop
// to avoid premature exiting from the test
function preventTestExitingEarly (t, ms) {
  const timeout = setTimeout(() => {}, ms)
  t.teardown(() => clearTimeout(timeout))
}

test('sample', t => {
  t.plan(1)
  const start = process.hrtime()
  const sampler = doc()

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    const end = process.hrtime(start)
    const elapsed = hrtime2ms(end)
    if (monitorEventLoopDelay) {
      t.true(elapsed >= 1000 && elapsed < 2000)
    } else {
      t.true(elapsed >= 500 && elapsed < 1000)
    }
  })
})

test('cpu', t => {
  t.plan(3)
  const sampler = doc()

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    t.equal('number', typeof sampler.cpu.usage)
    t.equal('object', typeof sampler.cpu.raw)
    let check
    let expected
    const value = sampler.cpu.usage
    if (performDetailedCheck) {
      check = value > 0 && value < 30
      expected = '0 < value < 30'
    } else {
      // Apparently, sometimes cpu usage is zero on windows runners.
      check = value >= 0
      expected = 'value >= 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)
  })
})

test('memory', t => {
  t.plan(8)
  const sampler = doc()

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    t.equal('number', typeof sampler.memory.rss)
    t.equal('number', typeof sampler.memory.heapTotal)
    t.equal('number', typeof sampler.memory.heapUsed)
    t.equal('number', typeof sampler.memory.external)

    let check
    let expected
    let value = sampler.memory.rss
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 150 : 180) * 1e6
      check = value > 0 && value < level
      expected = `0 < value < ${level}`
    } else {
      check = value > 0
      expected = 'value > 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)

    value = sampler.memory.heapTotal
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 100 : 120) * 1e6
      check = value > 0 && value < level
      expected = `0 < value < ${level}`
    } else {
      check = value > 0
      expected = 'value > 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)

    value = sampler.memory.heapUsed
    if (performDetailedCheck) {
      const level = (nodeMajorVersion >= 12 ? 80 : 100) * 1e6
      check = value > 0 && value < level
      expected = `0 < value < ${level}`
    } else {
      check = value > 0
      expected = 'value > 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)

    value = sampler.memory.external
    if (performDetailedCheck) {
      const level = 10 * 35e5
      check = value > 0 && value < level
      expected = `0 < value < ${level}`
    } else {
      check = sampler.memory.external > 0
      expected = 'value > 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)
  })
})

test('eventLoopDelay', t => {
  t.plan(3)
  const sampler = doc()

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    t.equal('number', typeof sampler.eventLoopDelay.computed)
    if (monitorEventLoopDelay) {
      t.equal('ELDHistogram', sampler.eventLoopDelay.raw.constructor.name)
    } else {
      t.equal('number', typeof sampler.eventLoopDelay.raw)
    }

    let check
    let expected
    const value = sampler.eventLoopDelay.computed
    if (performDetailedCheck) {
      const level = nodeMajorVersion >= 12 ? 1 : 20
      check = value > 0 && value < level
      expected = `0 < value < ${level}`
    } else {
      check = value >= 0
      expected = 'value >= 0'
    }
    t.true(check, `expected: ${expected}, value: ${value}`)
  })
})

test('eventLoopUtilization', { skip: !doc.eventLoopUtilizationSupported }, t => {
  t.plan(7)
  const sampler = doc()

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    t.equal('number', typeof sampler.eventLoopUtilization.idle)
    t.equal('number', typeof sampler.eventLoopUtilization.active)
    t.equal('number', typeof sampler.eventLoopUtilization.utilization)
    t.equal('object', typeof sampler.eventLoopUtilization.raw)
    t.equal('number', typeof sampler.eventLoopUtilization.raw.idle)
    t.equal('number', typeof sampler.eventLoopUtilization.raw.active)
    t.equal('number', typeof sampler.eventLoopUtilization.raw.utilization)
  })
})

test('gc', t => {
  t.plan(25)
  const sampler = doc({
    gcOptions: {
      aggregate: true
    },
    collect: {
      gc: true
    }
  })

  preventTestExitingEarly(t, 2000)

  const value = sampler.gc
  sampler.once('sample', () => {
    for (const key of ['pause', 'major', 'minor', 'incremental', 'weakCb']) {
      for (const subkey of ['mean', 'totalDuration', 'totalCount', 'max', 'stdDeviation']) {
        const message = `${key}.${subkey} expected: number, value: ${typeof value[key][subkey]}`
        t.true(typeof value[key][subkey] === 'number', message)
      }
    }
  })
})

test('gc aggregation with flags', { skip: !doc.gcFlagsSupported }, t => {
  t.plan(145)
  const sampler = doc({
    gcOptions: {
      aggregate: true
    },
    collect: {
      gc: true
    }
  })

  preventTestExitingEarly(t, 2000)

  const value = sampler.gc
  sampler.once('sample', () => {
    t.true(typeof value.pause.mean === 'number')
    t.true(typeof value.pause.totalDuration === 'number')
    t.true(typeof value.pause.totalCount === 'number')
    t.true(typeof value.pause.max === 'number')
    t.true(typeof value.pause.stdDeviation === 'number')
    for (const key of ['major', 'minor', 'incremental', 'weakCb']) {
      for (const flag of [
        'no',
        'constructRetained',
        'forced',
        'synchronousPhantomProcessing',
        'allAvailableGarbage',
        'allExternalMemory',
        'scheduleIdle'
      ]) {
        for (const subkey of ['mean', 'totalDuration', 'totalCount', 'max', 'stdDeviation']) {
          const message = `${key}.flags.${flag}.${subkey} expected: number, value: ${typeof value[key].flags[flag][subkey]}`
          t.true(typeof value[key].flags[flag][subkey] === 'number', message)
        }
      }
    }
  })
})

test('resourceUsage', { skip: !doc.resourceUsageSupported }, t => {
  const sampler = doc({ collect: { resourceUsage: true } })
  preventTestExitingEarly(t, 2000)
  sampler.once('sample', () => {
    t.is(sampler.cpu, undefined)
    t.is(sampler.resourceUsage.constructor.name, 'ResourceUsageMetric')
    t.is(sampler[kOptions].collect.cpu, false)
    t.is(sampler[kOptions].collect.resourceUsage, true)
    t.is(typeof sampler.resourceUsage.raw.userCPUTime, 'number')
    t.is(typeof sampler.resourceUsage.raw.systemCPUTime, 'number')
    t.is(typeof sampler.resourceUsage.raw.maxRSS, 'number')
    t.is(typeof sampler.resourceUsage.raw.userCPUTime, 'number')
    t.is(typeof sampler.resourceUsage.raw.sharedMemorySize, 'number')
    t.is(typeof sampler.resourceUsage.raw.unsharedDataSize, 'number')
    t.is(typeof sampler.resourceUsage.raw.unsharedStackSize, 'number')
    t.is(typeof sampler.resourceUsage.raw.minorPageFault, 'number')
    t.is(typeof sampler.resourceUsage.raw.majorPageFault, 'number')
    t.is(typeof sampler.resourceUsage.raw.swappedOut, 'number')
    t.is(typeof sampler.resourceUsage.raw.fsRead, 'number')
    t.is(typeof sampler.resourceUsage.raw.fsWrite, 'number')
    t.is(typeof sampler.resourceUsage.raw.ipcSent, 'number')
    t.is(typeof sampler.resourceUsage.raw.ipcReceived, 'number')
    t.is(typeof sampler.resourceUsage.raw.signalsCount, 'number')
    t.is(typeof sampler.resourceUsage.raw.voluntaryContextSwitches, 'number')
    t.is(typeof sampler.resourceUsage.raw.involuntaryContextSwitches, 'number')
    t.ok(sampler.resourceUsage.cpu >= 0, `value ${sampler.resourceUsage.cpu}`)
    t.end()
  })
})

test('activeHandles', t => {
  t.plan(1)
  const sampler = doc({
    collect: {
      activeHandles: true
    }
  })

  preventTestExitingEarly(t, 2000)

  sampler.once('sample', () => {
    const value = sampler.activeHandles
    const check = value > 0
    const expected = 'value > 0'
    t.true(check, `expected: ${expected}, value: ${value}`)
  })
})

test('custom sample interval', t => {
  const start = process.hrtime()
  const sampler = doc({ sampleInterval: 2000 })
  preventTestExitingEarly(t, 4000)
  sampler.once('sample', () => {
    const end = process.hrtime(start)
    const elapsed = hrtime2ms(end)
    t.true(elapsed >= 2000 && elapsed < 2200)
    t.end()
  })
})

test('stop', t => {
  t.plan(4)
  const sampler = doc({ collect: { gc: true } })
  preventTestExitingEarly(t, 3000)

  sampler.on('sample', () => {
    // On Windows CI runners the cpu is zero, smh.
    t.true(sampler.cpu.usage >= 0, `cpu value: ${sampler.cpu.usage}`)
    t.true(sampler.memory.heapTotal > 0, `memory value: ${sampler.memory.heapTotal}`)
    // On Windows CI runners the delay is zero, smh.
    t.true(sampler.eventLoopDelay.computed >= 0, `delay value: ${sampler.eventLoopDelay.computed}`)
    t.true(sampler.gc.pause.max >= 0, `gc value: ${sampler.gc.pause.max}`)
    sampler.stop()
  })
})

test('start and stop', t => {
  t.plan(9)
  const sampler = doc({ collect: { gc: true } })
  preventTestExitingEarly(t, 6000)

  let c = 0
  const start = process.hrtime()
  sampler.on('sample', () => {
    c++
    const delta = hrtime2ms(process.hrtime(start))
    // On Windows CI runners the cpu is zero, smh.
    t.true(sampler.cpu.usage >= 0, `cpu value: ${sampler.cpu.usage}`)
    t.true(sampler.memory.heapTotal > 0, `memory value: ${sampler.memory.heapTotal}`)
    // On Windows CI runners the delay is zero, smh.
    t.true(sampler.eventLoopDelay.computed >= 0, `delay value: ${sampler.eventLoopDelay.computed}`)
    t.true(sampler.gc.pause.max >= 0, `gc value: ${sampler.gc.pause.max}`)
    if (c === 2) {
      // On Node 10 this is near 2500, while on Node > 14
      // it is near 3500. There must be some differences
      // in rescheduling the timers there.
      t.true(delta > 2500, `delta value: ${delta}`)
      return
    }
    sampler.stop()
    setTimeout(() => sampler.start(), 1500)
  })
})
