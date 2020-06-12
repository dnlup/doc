'use strict'

const tasks = arr => arr.join(' && ')

module.exports = {
  hooks: {
    'pre-commit': tasks([
      'npm run lint',
      'npm run doc'
    ])
  }
}
