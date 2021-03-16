const { test } = require('tap')
const { execSync } = require('child_process')
const { join } = require('path')
const { satisfies } = require('semver')

test('self resolution', { skip: !satisfies(process.version, '>=12') }, t => {
  try {
    const file = join(__dirname, 'selfResolution.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})

test('named exports', { skip: !satisfies(process.version, '>=14.13.0 || 12.20.0') }, t => {
  try {
    const file = join(__dirname, 'namedExports.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})
