# doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)

> Get usage and health data about your Node.js process.

`doc` is a small module that helps you collect health metrics about your Node.js process.
It does that by using only the API available on Node itself (no native dependencies).
It doesn't have any ties with an APM platform, so you are free to use anything you want for that purpose.
Its API lets you access both computed and raw values, where possible.

## Installation

###### latest stable version

```bash
npm i @dnlup/doc
```

###### latest development version

```bash
npm i @dnlup/doc@next
```

## Usage

You can import the module by using either CommonJS or ESM.

By default `doc` returns a [`Sampler`](#class-docsampler) instance that collects metrics about cpu, memory usage, event loop delay and event loop utilization (only on Node versions that [support it](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2)).

###### Importing with CommonJS

```js
const doc = require('@dnlup/doc')

const sampler = doc() // Use the default options

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.utilization) // Available only on Node versions that support it
})
```

###### Importing with ESM

```js
import doc from '@dnlup/doc'

const sampler = doc()

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.utilization) // Available only on Node versions that support it
})
```

###### Note

A `Sampler` holds a snapshot of the metrics taken at the specified sample interval.
This behavior makes the instance stateful. On every tick, a new snapshot will overwrite the previous one.

##### Enable/disable metrics collection

You can disable the metrics that you don't need.

```js
const doc = require('@dnlup/doc')

// Collect only the event loop delay
const sampler = doc({ collect: { cpu: false, memory: false } })

sampler.on('sample', () => {
  // `sampler.cpu` will be `undefined`
  // `sampler.memory` will be `undefined`
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.utilization) // Available only on Node versions that support it
})
```

You can enable more metrics if you need them.

##### Garbage collection

```js
const doc = require('@dnlup/doc')

const sampler = doc({ collect: { gc: true } })
sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.utilization) // Available only on Node versions that support it
  doStuffWithGarbageCollectionDuration(sampler.gc.pause)
})
```

##### Active handles

```js
const doc = require('@dnlup/doc')

const sampler = doc({ collect: { activeHandles: true } })

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.utilization) // Available only on Node versions that support it
  doStuffWithActiveHandles(sampler.activeHandles)
})
```

### Examples

You can find more examples in the [`examples`](https://github.com/dnlup/doc/tree/HEAD/examples) folder.

## License

[ISC](https://github.com/dnlup/doc/tree/HEAD/LICENSE)
