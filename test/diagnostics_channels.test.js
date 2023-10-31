'use strict'

const { test } = require('tap')
const diagnosticsChannel = require('diagnostics_channel')
const doc = require('../')

test('diagnostics channel support', t => {
  t.plan(2)
  t.teardown(() => {
    sampler.stop()
  })
  const onInstance = s => {
    t.equal(s, sampler)
    diagnosticsChannel.unsubscribe(doc.constants.DOC_CHANNEL, onInstance)
  }
  const onSample = (s) => {
    t.equal(s, sampler)
    diagnosticsChannel.unsubscribe(doc.constants.DOC_SAMPLES_CHANNEL, onSample)
  }
  diagnosticsChannel.subscribe(doc.constants.DOC_CHANNEL, onInstance)
  diagnosticsChannel.subscribe(doc.constants.DOC_SAMPLES_CHANNEL, onSample)
  const sampler = doc({ unref: false })
})
