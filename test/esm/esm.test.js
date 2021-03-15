const { test } = require('tap')
const { execSync } = require('child_process')
const { join } = require('path')

const nodeMajorVersion = parseInt(process.versions.node.split('.')[0])

test('sample', { skip: nodeMajorVersion <= 11 }, t => {
  try {
    const file = join(__dirname, 'esm.mjs')
    execSync(`node ${file}`)
  } catch (e) {
    t.error(e)
  } finally {
    t.end()
  }
})
