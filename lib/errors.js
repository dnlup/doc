'use strict'

class InvalidArgumentError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, InvalidArgumentError)
    this.name = 'InvalidArgumentError'
    this.code = 'DOC_ERR_INVALID_ARG'
  }
}

class NotSupportedError extends Error {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, NotSupportedError)
    this.name = 'NotSupportedError'
    this.code = 'DOC_ERR_NOT_SUPPORTED'
  }
}

module.exports = {
  InvalidArgumentError,
  NotSupportedError
}
