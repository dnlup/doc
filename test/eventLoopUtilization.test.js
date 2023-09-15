'use strict'

const tap = require('tap')
const sleep = require('atomic-sleep')
const EventLoopUtilizationMetric = require('../lib/eventLoopUtilization')
const {
  kSample
} = require('../lib/symbols')

tap.test('raw metric', t => {
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
