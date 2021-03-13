'use strict'

const { test } = require('tap')
const config = require('../lib/config')
const {
  monitorEventLoopDelaySupported,
  eventLoopUtilizationSupported,
  gcFlagsSupported,
  resourceUsageSupported
} = require('../lib/util')
const { InvalidArgumentError, NotSupportedError } = require('../lib/errors')

test('validation', t => {
  const list = [
    {
      config: {
        sampleInterval: '3'
      },
      instanceOf: InvalidArgumentError,
      message: 'sampleInterval must be a number, received string 3'
    },
    {
      config: {
        sampleInterval: {}
      },
      instanceOf: InvalidArgumentError,
      message: 'sampleInterval must be a number, received object [object Object]'
    },
    {
      config: {
        sampleInterval: 0
      },
      instanceOf: InvalidArgumentError,
      message: 'sampleInterval must be > 1, received 0'
    },
    {
      config: {
        autoStart: 0
      },
      instanceOf: InvalidArgumentError,
      message: 'autoStart must be a boolean, received number 0'
    },
    {
      config: {
        unref: 0
      },
      instanceOf: InvalidArgumentError,
      message: 'unref must be a boolean, received number 0'
    },
    {
      config: {
        eventLoopDelayOptions: {
          resolution: '0'
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'eventLoopDelayOptions.resolution must be a number, received string 0'
    },
    {
      config: {
        sampleInterval: 100,
        eventLoopDelayOptions: {
          resolution: 200
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'eventLoopDelayOptions.resolution must be < sampleInterval, received 200'
    },
    {
      config: {
        eventLoopDelayOptions: {
          resolution: -200
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'eventLoopDelayOptions.resolution must be > 1, received -200'
    },
    {
      config: {
        gcOptions: {
          aggregate: 1
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'gcOptions.aggregate must be a boolean, received number 1'
    },
    {
      config: {
        gcOptions: {
          flags: 1
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'gcOptions.flags must be a boolean, received number 1'
    },
    {
      config: {
        collect: {
          cpu: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.cpu must be a boolean, received string '
    },
    {
      config: {
        collect: {
          memory: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.memory must be a boolean, received string '
    },
    {
      config: {
        collect: {
          eventLoopDelay: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.eventLoopDelay must be a boolean, received string '
    },
    {
      config: {
        collect: {
          eventLoopUtilization: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.eventLoopUtilization must be a boolean, received string '
    },
    {
      config: {
        collect: {
          gc: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.gc must be a boolean, received string '
    },
    {
      config: {
        collect: {
          activeHandles: ''
        }
      },
      instanceOf: InvalidArgumentError,
      message: 'collect.activeHandles must be a boolean, received string '
    }
  ]

  for (const [index, item] of list.entries()) {
    const error = t.throws(() => config(item.config), item.instanceOf)
    t.is(error.message, item.message, `list item ${index}`)
  }

  let opts = config({ eventLoopDelayOptions: {} })
  t.is(opts.eventLoopDelayOptions.resolution, 10)
  opts = config({ eventLoopDelayOptions: { resolution: null } })
  t.is(opts.eventLoopDelayOptions.resolution, 10)

  opts = config({ sampleInterval: null })
  t.is(opts.sampleInterval, monitorEventLoopDelaySupported ? 1000 : 500)
  t.end()
})

test('should throw if eventLoopUtilization is not supported', { skip: eventLoopUtilizationSupported }, t => {
  const error = t.throws(() => {
    config({
      collect: {
        eventLoopUtilization: true
      }
    })
  }, NotSupportedError)
  t.is(error.message, 'eventLoopUtilization is not supported on the Node.js version used')
  t.end()
})

test('shuold throw if GC flags are not supported', { skip: gcFlagsSupported }, t => {
  const error = t.throws(() => {
    config({
      gcOptions: {
        aggregate: true,
        flags: true
      }
    })
  }, NotSupportedError)
  t.is(error.message, 'GC flags are not supported on the Node.js version used')
  t.end()
})

test('should throw if resourceUsage is not supported', { skip: resourceUsageSupported }, t => {
  const error = t.throws(() => {
    config({
      collect: {
        resourceUsage: true
      }
    })
  }, NotSupportedError)
  t.is(error.message, 'resourceUsage is not supported on the Node.js version used')
  t.end()
})

test('should disable cpu if resourceUsage is enabled', { skip: !resourceUsageSupported }, t => {
  const opts = config({
    collect: {
      cpu: true,
      resourceUsage: true
    }
  })
  t.false(opts.collect.cpu)
  t.true(opts.collect.resourceUsage)
  t.end()
})

test('default options', t => {
  const opts = config()
  t.equals(opts.sampleInterval, monitorEventLoopDelaySupported ? 1000 : 500)
  t.true(opts.autoStart)
  t.true(opts.unref)
  t.deepEquals(opts.eventLoopDelayOptions, { resolution: 10 })
  t.false(opts.gcOptions.aggregate)
  t.equals(opts.gcOptions.flags, gcFlagsSupported)
  t.true(opts.collect.cpu)
  t.true(opts.collect.memory)
  t.false(opts.collect.resourceUsage)
  t.true(opts.collect.eventLoopDelay)
  t.equals(opts.collect.eventLoopUtilization, eventLoopUtilizationSupported)
  t.false(opts.collect.gc)
  t.false(opts.collect.activeHandles)
  t.end()
})
