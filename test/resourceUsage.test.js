'use strict'

const tap = require('tap')
const { hrtime2ns } = require('@dnlup/hrtime-utils')
const ResourceUsageMetric = require('../lib/resourceUsage')
const {
  kSample
} = require('../lib/symbols')

const cpu = function (iterations = 1e6) {
  for (let i = 0; i < iterations; i++) {
    new Date(Date.now()) // eslint-disable-line no-new
  }
}
tap.test('should throw an error if is not supported', { skip: !!process.resourceUsage }, t => {
  const error = t.throw(() => {
    const resourceUsage = new ResourceUsageMetric() // eslint-disable-line no-unused-vars
  })
  t.ok(error.message, 'resourceUsage is not supported on this Node.js version')
  t.end()
})

tap.test('raw metric', { skip: !process.resourceUsage }, t => {
  const resourceUsage = new ResourceUsageMetric()
  const start = process.hrtime()
  cpu()
  const delta = process.hrtime(start)
  resourceUsage[kSample](hrtime2ns(delta))
  t.equal(typeof resourceUsage.raw.userCPUTime, 'number')
  t.equal(typeof resourceUsage.raw.systemCPUTime, 'number')
  t.equal(typeof resourceUsage.raw.maxRSS, 'number')
  t.equal(typeof resourceUsage.raw.userCPUTime, 'number')
  t.equal(typeof resourceUsage.raw.sharedMemorySize, 'number')
  t.equal(typeof resourceUsage.raw.unsharedDataSize, 'number')
  t.equal(typeof resourceUsage.raw.unsharedStackSize, 'number')
  t.equal(typeof resourceUsage.raw.minorPageFault, 'number')
  t.equal(typeof resourceUsage.raw.majorPageFault, 'number')
  t.equal(typeof resourceUsage.raw.swappedOut, 'number')
  t.equal(typeof resourceUsage.raw.fsRead, 'number')
  t.equal(typeof resourceUsage.raw.fsWrite, 'number')
  t.equal(typeof resourceUsage.raw.ipcSent, 'number')
  t.equal(typeof resourceUsage.raw.ipcReceived, 'number')
  t.equal(typeof resourceUsage.raw.signalsCount, 'number')
  t.equal(typeof resourceUsage.raw.voluntaryContextSwitches, 'number')
  t.equal(typeof resourceUsage.raw.involuntaryContextSwitches, 'number')
  t.end()
})

tap.test('computed metric', { skip: !process.resourceUsage }, t => {
  const resourceUsage = new ResourceUsageMetric()
  const start = process.hrtime()
  cpu()
  const delta = process.hrtime(start)
  resourceUsage[kSample](hrtime2ns(delta))
  t.ok(resourceUsage.cpu > 50, `value ${resourceUsage.cpu}`)
  t.end()
})
