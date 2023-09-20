'use strict'

const { test } = require('tap')
const config = require('../lib/config')
const { InvalidArgumentError } = require('../lib/errors')

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
    t.equal(error.message, item.message, `list item ${index}`)
  }

  let opts = config({ eventLoopDelayOptions: {} })
  t.ok(opts.eventLoopDelayOptions.resolution, 10)
  opts = config({ eventLoopDelayOptions: { resolution: null } })
  t.ok(opts.eventLoopDelayOptions.resolution, 10)

  opts = config({ sampleInterval: null })
  t.equal(opts.sampleInterval, 1000)
  t.end()
})

test('should disable cpu if resourceUsage is enabled', t => {
  const opts = config({
    collect: {
      cpu: true,
      resourceUsage: true
    }
  })
  t.notOk(opts.collect.cpu)
  t.ok(opts.collect.resourceUsage)
  t.end()
})

test('default options', t => {
  const opts = config()
  t.equal(opts.sampleInterval, 1000)
  t.ok(opts.autoStart)
  t.ok(opts.unref)
  t.same(opts.eventLoopDelayOptions, { resolution: 10 })
  t.notOk(opts.gcOptions.aggregate)
  t.equal(opts.gcOptions.flags, true)
  t.ok(opts.collect.cpu)
  t.ok(opts.collect.memory)
  t.notOk(opts.collect.resourceUsage)
  t.ok(opts.collect.eventLoopDelay)
  t.equal(opts.collect.eventLoopUtilization, true)
  t.notOk(opts.collect.gc)
  t.notOk(opts.collect.activeHandles)
  t.end()
})
