# doc

<p align="center"><img src="./doc.webp" alt="Doc Brown"></p>

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)
![Tests](https://github.com/dnlup/doc/workflows/Tests/badge.svg)

> See how many Gigawatts your Node.js process is using.

`doc` is a small module that helps you collect health metrics about your Node.js process.
It does that by using only the API provided by Node itself.
It is not coupled with any APM platforms so you are free to use anything you want for that purpose.
Its API are designed to let you access both computed and raw values, where possible.

<!-- toc -->

- [Installation](#installation)
        * [If you need the latest development version](#if-you-need-the-latest-development-version)
- [Usage](#usage)
      - [Enable/disable metrics collection](#enabledisable-metrics-collection)
        * [Garbage collection](#garbage-collection)
        * [Active handles](#active-handles)
- [API](#api)
  * [doc([options])](#docoptions)
  * [Class: `doc.Sampler`](#class-docsampler)
    + [Event: '`sample`'](#event-sample)
- [Contributing](#contributing)
- [Credits](#credits)

<!-- tocstop -->

## Installation

```bash
$ npm i @dnlup/doc
```

###### If you need the latest development version

```bash
$ npm i @dnlup/doc@next
```
## Usage

By default `doc` returns a [`Sampler`]() instance that collects metrics about cpu, memory usage and event loop delay.

```js
const doc = require('@dnlup/doc');

const sampler = doc(); // Use the default options

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
})
```

A `Sampler` holds a snapshot of the metrics at the specified sample interval.
This makes the instance stateful. On every tick a new snapshot will overwrite the previous one.

##### Enable/disable metrics collection

You can disable metrics you don't need.

```js
const doc = require('@dnlup/doc')

// Collect only the event loop delay
const sampler = doc({ collect: { cpu: false, memory: false } })

sampler.on('sample', () => {
  // `sampler.cpu` will be `undefined`
  // `sampler.memory` will be `undefined`
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
})
```

You can enable more metrics, if you need them.

###### Garbage collection

```js
const doc = require('@dnlup/doc');

const sampler = doc({ collect: { gc: true } })
sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithGarbageCollectionDuration(sampler.gc)
})
```

###### Active handles

```js
const doc = require('@dnlup/doc')

const sampler = doc({ collect: { activeHandles: true } })

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithActiveHandles(sampler.activeHandles)
})
```

## API

### doc([options])

> Create a new metrics [`Sampler`]() instance with the given options.

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [sample](#sample) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to sample the event loop delay and this allows to increase the default sample interval.
  * `eventLoopOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `memory` `<boolean>`: enable memory metric. **Default:** `true`.
    * `gc` `<boolean>`: enable garbage collection metric. **Default:** `false`.
    * `activeHandles` `<boolean>`: enable active handles collection metric. **Default:** `false`.
* Returns: [`<Sampler>`]()

### Class: `doc.Sampler`

> Metrics sampler.

#### Event: '`sample`'

## Contributing

## Credits
