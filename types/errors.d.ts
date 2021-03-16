declare namespace Errors {
  /** An argument or option was invalid */
  export class InvalidArgumentError extends Error {
    name: 'InvalidArgumentError'
    code: 'DOC_ERR_INVALID_ARG'
  }

  /** A metric is not supported */
  export class NotSupportedError extends Error {
    name: 'NotSupportedError'
    code: 'DOC_ERR_NOT_SUPPORTED'
  }
}

export = Errors
