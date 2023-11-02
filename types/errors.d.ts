declare namespace Errors {
  /** An argument or option was invalid */
  export class InvalidArgumentError extends Error {
    name: 'InvalidArgumentError'
    code: 'DOC_ERR_INVALID_ARG'
  }
}

export = Errors
