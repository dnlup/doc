const { test } = require('tap')
const { execSync } = require('child_process')
const { join } = require('path')

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0])

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

test('named exports', { skip: nodeMajorVersion <= 11 }, t => {
  try {
    const file = join(__dirname, 'namedExports.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})
