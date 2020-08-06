'use strict'

/**
 * Configuration options schema.
 * This is used by `ajv-cli` to compile the validation function
 * used internally by Doc.
 * The `validate.js` file containing the function is generated with the
 * `npm run build` script.
 */
module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    sampleInterval: {
      type: 'number',
      minimum: 1
    },
    eventLoopOptions: {
      type: 'object',
      default: {
        resolution: 10
      },
      additionalProperties: false,
      properties: {
        resolution: {
          type: 'number',
          default: 10,
          minimum: 1
          // TODO: add maximum?
        }
      }
    },
    collect: {
      type: 'object',
      additionalProperties: false,
      default: {
        cpu: true,
        memory: true,
        eventLoopDelay: true,
        gc: false,
        activeHandles: false
      },
      properties: {
        cpu: {
          type: 'boolean',
          default: true
        },
        memory: {
          type: 'boolean',
          default: true
        },
        eventLoopDelay: {
          type: 'boolean',
          default: true
        },
        gc: {
          type: 'boolean',
          default: false
        },
        activeHandles: {
          type: 'boolean',
          default: false
        }
      }
    }
  }
}
