const { test } = require('tap')
const { execSync } = require('child_process')
const { join } = require('path')

test('self resolution', t => {
  try {
    const file = join(__dirname, 'selfResolution.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})

test('named exports', t => {
  try {
    const file = join(__dirname, 'namedExports.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})
