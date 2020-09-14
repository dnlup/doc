# doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)
![Tests](https://github.com/dnlup/doc/workflows/Tests/badge.svg)

> Get usage and health data about your Node.js process.

`doc` is a small module that helps you collect health metrics about your Node.js process.
It does that by using only the API provided by Node itself.
It is not coupled with any APM platform so you are free to use anything you want for that purpose.
Its API are designed to let you access both computed and raw values, where possible.

<!-- toc -->

- [Installation](#installation)
        * [latest stable version](#latest-stable-version)
        * [latest development version](#latest-development-version)
- [Usage](#usage)
      - [Enable/disable metrics collection](#enabledisable-metrics-collection)
        * [Garbage collection](#garbage-collection)
        * [Active handles](#active-handles)
- [API](#api)
  * [doc([options])](#docoptions)
  * [Class: `doc.Sampler`](#class-docsampler)
    + [new `doc.Sampler([options])`](#new-docsampleroptions)
    + [Event: '`sample`'](#event-sample)
    + [`sampler.start()`](#samplerstart)
    + [`sampler.stop()`](#samplerstop)
    + [`sampler.cpu`](#samplercpu)
    + [`sampler.eventLoopDelay`](#samplereventloopdelay)
    + [`sampler.gc`](#samplergc)
    + [`sampler.activeHandles`](#sampleractivehandles)
    + [`sampler.memory`](#samplermemory)
  * [Class: `CpuMetric`](#class-cpumetric)
    + [`cpuMetric.usage`](#cpumetricusage)
    + [`cpuMetric.raw`](#cpumetricraw)
  * [Class: `EventLoopDelayMetric`](#class-eventloopdelaymetric)
    + [`eventLoopDelay.computed`](#eventloopdelaycomputed)
    + [`eventLoopDelay.raw`](#eventloopdelayraw)
    + [`eventLoopDelay.compute(raw)`](#eventloopdelaycomputeraw)
  * [Class: `GCMetric`](#class-gcmetric)
    + [`gcMetric.major`](#gcmetricmajor)
    + [`gcMetric.minor`](#gcmetricminor)
    + [`gcMetric.incremental`](#gcmetricincremental)
    + [`gcMetric.weakCb`](#gcmetricweakcb)
  * [Class: `GCAggregatedEntry`](#class-gcaggregatedentry)
    + [`gcAggregatedEntry.count`](#gcaggregatedentrycount)
    + [`gcAggregatedEntry.total`](#gcaggregatedentrytotal)
    + [`gcAggregatedEntry.average`](#gcaggregatedentryaverage)
    + [`gcAggregatedEntry.flags`](#gcaggregatedentryflags)
        * [`count`](#count)
        * [`total`](#total)
- [Credits](#credits)

<!-- tocstop -->

## Installation

###### latest stable version

```bash
$ npm i @dnlup/doc
```

###### latest development version

```bash
$ npm i @dnlup/doc@next
```
## Usage

By default `doc` returns a [`Sampler`](#class-docsampler) instance that collects metrics about cpu, memory usage and event loop delay.

```js
const doc = require('@dnlup/doc');

const sampler = doc(); // Use the default options

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
})
```

A `Sampler` holds a snapshot of the metrics taken at the specified sample interval.
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

Create a new metrics [`Sampler`](#class-docsampler) instance with the given options.

* `options` `<Object>`: same as the `Sampler` [`options`](#new-docsampleroptions).
* Returns: [`<Sampler>`](#class-docsampler)

### Class: `doc.Sampler`

* Extends [`EventEmitter`](https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).

Metrics sampler.

It collects the selected metrics on a regular interval. A `Sampler` instance is stateful so, on each tick,
only the values of the last sample are available. The old ones are overwritten each time a new [`sample`](#event-sample)
event is emited.

#### new `doc.Sampler([options])`

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-sample) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to track the event loop delay and this allows to increase the default `sampleInterval`.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v12.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `eventLoopOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `memory` `<boolean>`: enable memory metric. **Default:** `true`.
    * `gc` `<boolean>`: enable garbage collection metric. **Default:** `false`.
    * `activeHandles` `<boolean>`: enable active handles collection metric. **Default:** `false`.

#### Event: '`sample`'

Emitted every `sampleInterval`, it signals that new data has been sampled. 

#### `sampler.start()`

Start collecting metrics.

#### `sampler.stop()`

Stop collecting metrics.

#### `sampler.cpu`

* [`<CpuMetric>`](#class-cpumetric)

Cpu metric instance.

#### `sampler.eventLoopDelay`

* [`<EventLoopDelayMetric>`](#class-eventloopdelaymetric)

Event loop delay metric instance.

#### `sampler.gc`

* [`<GCMetric>`](#class-gcmetric)

Garbage collector metric instance.

#### `sampler.activeHandles`

* `<number>`

Number of active handles returned by `process._getActiveHandles()`.

#### `sampler.memory`

* `<object>`

Object returned by [`process.memoryUsage()`](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_memoryusage).

### Class: `CpuMetric`

Exposes both computed and raw values of the cpu usage.

#### `cpuMetric.usage`

* `<number>`

Cpu usage in percentage.

#### `cpuMetric.raw`

* `<object>`

Raw value returned by [`process.cpuUsage()`](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_cpuusage_previousvalue).

### Class: `EventLoopDelayMetric`

Exposes both computed and raw values about the event loop delay.

#### `eventLoopDelay.computed`

* `<number>`

Event loop delay in milliseconds. On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v13.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) this value is computed using the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance, otherwise a simple timer is used to calculate it.

#### `eventLoopDelay.raw`

* `<Histogram|number>`

On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) this exposes the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance, otherwise it exposes the raw delay value in nanoseconds.

#### `eventLoopDelay.compute(raw)`

* `raw` `<number>` The raw value taken using the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) API.
* Returns `<number>` The computed delay value.

This method is meamt to use only on node versions that supports [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). It allows to get computed values of the event loop delay from other values than the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

### Class: `GCMetric`

Exposes the garbage collector activity only with computed values. The rolling average of each type of operation is calculated during the specified `sampleInterval`.

#### `gcMetric.major`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

Activity of the operation of type `major`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.minor`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

Activity of the operation of type `minor`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.incremental`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

Activity of the operation of type `incremental`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.weakCb`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

Activity of the operation of type `weakCb`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

### Class: `GCAggregatedEntry`

Entry containing aggregated data about a specific garbage collector operation.

#### `gcAggregatedEntry.count`

* `<number>`

The number of times the operation occurred.

#### `gcAggregatedEntry.total`

* `<number>`

The total time (in milliseconds) spent on the operation.

#### `gcAggregatedEntry.average`

* `<number>`

The average time (in milliseconds) spent each time in the operation.

#### `gcAggregatedEntry.flags`

* `<Map>`

On Node versions that support [`flags`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags) this `Map` is populated with additional metrics about the number of times a specific flag was encountered and the total time (in milliseconds) spent on the operation with this flag.

Each key of the `Map` is one of these strings:

* `'no'`
* `'constructRetained'`
* `'forced'`
* `'synchronousPhantomProcessing'`
* `'allAvailableGarbage'`
* `'allExternalMemory'`
* `'scheduleIdle'`

See [`performanceEntry.flags`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags).

Each value of the `Map` is an `<object>` with the following properties:

###### `count`

* `<number>`

The number of time that the flag was encountered.

###### `total`

* `<number>`

The total time (in milliseconds) spent on the operations with this flag.

## Credits

When writing this module a lot of inspiration was taken from the awesome [Node Clinic Doctor](https://github.com/clinicjs/node-clinic-doctor) package.
