'use strict'

const tap = require('tap')
const { eventLoopUtilization } = require('perf_hooks').performance
const sleep = require('atomic-sleep')
const EventLoopUtilizationMetric = require('../lib/eventLoopUtilization')
const {
  kSample
} = require('../lib/symbols')

tap.test('should throw an error if not supported', { skip: !!eventLoopUtilization }, t => {
  const error = t.throw(() => {
    const eluMetric = new EventLoopUtilizationMetric() // eslint-disable-line no-unused-vars
  }, Error)
  t.is(error.message, 'eventLoopUtilization is not supported on this Node.js version')
  t.end()
})

tap.test('raw metric', { skip: !eventLoopUtilization }, t => {
  const eluMetric = new EventLoopUtilizationMetric()
  setTimeout(() => {
    eluMetric[kSample]()
    sleep(1000)
    eluMetric[kSample]()
    t.ok(eluMetric.raw.utilization > 0.7)
    t.ok(eluMetric.utilization > 0.7)
    t.end()
  }, 10)
})
