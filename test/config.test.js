'use strict'

const tap = require('tap')
const config = require('../lib/config')

tap.test('invalid options', t => {
  const list = [
    {
      config: {
        sampleInterval: '3'
      },
      instanceOf: TypeError,
      message: 'sampleInterval must be a number, received string 3'
    },
    {
      config: {
        sampleInterval: {}
      },
      instanceOf: TypeError,
      message: 'sampleInterval must be a number, received object [object Object]'
    },
    {
      config: {
        sampleInterval: 0
      },
      instanceOf: RangeError,
      message: 'sampleInterval must be > 1, received 0'
    },
    {
      config: {
        autoStart: 0
      },
      instanceOf: TypeError,
      message: 'autoStart must be a boolean, received number 0'
    },
    {
      config: {
        unref: 0
      },
      instanceOf: TypeError,
      message: 'unref must be a boolean, received number 0'
    },
    {
      config: {
        eventLoopOptions: {
          resolution: '0'
        }
      },
      instanceOf: TypeError,
      message: 'eventLoopOptions.resolution must be a number, received string 0'
    },
    {
      config: {
        sampleInterval: 100,
        eventLoopOptions: {
          resolution: 200
        }
      },
      instanceOf: RangeError,
      message: 'eventLoopOptions.resolution must be < sampleInterval, received 200'
    },
    {
      config: {
        eventLoopOptions: {
          resolution: -200
        }
      },
      instanceOf: RangeError,
      message: 'eventLoopOptions.resolution must be > 1, received -200'
    },
    {
      config: {
        collect: {
          cpu: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.cpu must be a boolean, received string '
    },
    {
      config: {
        collect: {
          memory: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.memory must be a boolean, received string '
    },
    {
      config: {
        collect: {
          eventLoopDelay: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.eventLoopDelay must be a boolean, received string '
    },
    {
      config: {
        collect: {
          eventLoopUtilization: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.eventLoopUtilization must be a boolean, received string '
    },
    {
      config: {
        collect: {
          gc: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.gc must be a boolean, received string '
    },
    {
      config: {
        collect: {
          activeHandles: ''
        }
      },
      instanceOf: TypeError,
      message: 'collect.activeHandles must be a boolean, received string '
    }
  ]

  for (const [index, item] of list.entries()) {
    const error = t.throws(() => config(item.config), item.instanceOf)
    t.is(error.message, item.message, `list item ${index}`)
  }
  t.end()
})
