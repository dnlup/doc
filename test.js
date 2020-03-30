'use strict'

const tap = require('tap')
const { monitorEventLoopDelay } = require('perf_hooks')
const doc = require('./')

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

  // Since the internal timer of the Doc instance
  // is unref(ed), manually schedule work on the event loop
  // to avoid premature exiting from the test
  setTimeout(() => {}, 2000)
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
    t.true(data.eventLoopDelay > 0)
    t.true(data.cpu > 0 && data.cpu < 100)
    t.true(data.memory.rss > 0)
    t.true(data.memory.heapTotal > 0)
    t.true(data.memory.heapUsed > 0)
    t.true(data.memory.external > 0)
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
