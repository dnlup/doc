'use strict'

class InvalidArgumentError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, InvalidArgumentError)
    this.name = 'InvalidArgumentError'
    this.code = 'DOC_ERR_INVALID_ARG'
  }
}

module.exports = {
  InvalidArgumentError
}
