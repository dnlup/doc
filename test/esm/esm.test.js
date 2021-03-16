const { test } = require('tap')
const { execSync } = require('child_process')
const { join } = require('path')

const versions = process.versions.node.split('.')
const nodeMajorVersion = parseInt(versions[0])
const nodeMinorVersion = parseInt(versions[1])

test('self resolution', { skip: nodeMajorVersion <= 11 }, t => {
  try {
    const file = join(__dirname, 'selfResolution.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})

test('named exports', { skip: nodeMajorVersion <= 12 && nodeMinorVersion < 20 }, t => {
  try {
    const file = join(__dirname, 'namedExports.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})
