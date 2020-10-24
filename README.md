# doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)
![Tests](https://github.com/dnlup/doc/workflows/Tests/badge.svg)
![Benchmarks](https://github.com/dnlup/doc/workflows/Benchmarks/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/dnlup/doc/badge.svg?branch=next)](https://coveralls.io/github/dnlup/doc?branch=next)
[![Known Vulnerabilities](https://snyk.io/test/github/dnlup/doc/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dnlup/doc?targetFile=package.json)

> Get usage and health data about your Node.js process.

`doc` is a small module that helps you collect health metrics about your Node.js process.
It does that by using only the API provided available on Node itself.
It doesn't have any ties with an APM platform, so you are free to use anything you want for that purpose.
Its API lets you access both computed and raw values, where possible.

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
    + [`sampler.resourceUsage`](#samplerresourceusage)
    + [`sampler.eventLoopDelay`](#samplereventloopdelay)
    + [`sampler.eventLoopUtilization`](#samplereventlooputilization)
    + [`sampler.gc`](#samplergc)
    + [`sampler.activeHandles`](#sampleractivehandles)
    + [`sampler.memory`](#samplermemory)
  * [Class: `CpuMetric`](#class-cpumetric)
    + [`cpuMetric.usage`](#cpumetricusage)
    + [`cpuMetric.raw`](#cpumetricraw)
  * [Class: `ResourceUsageMetric`](#class-resourceusagemetric)
    + [`resourceUsage.cpu`](#resourceusagecpu)
    + [`resourceUsage.raw`](#resourceusageraw)
  * [Class: `EventLoopDelayMetric`](#class-eventloopdelaymetric)
    + [`eventLoopDelay.computed`](#eventloopdelaycomputed)
    + [`eventLoopDelay.raw`](#eventloopdelayraw)
    + [`eventLoopDelay.compute(raw)`](#eventloopdelaycomputeraw)
  * [Class: `EventLoopUtilizationMetric`](#class-eventlooputilizationmetric)
    + [`eventLoopUtilization.raw`](#eventlooputilizationraw)
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
- [Contributing](#contributing)
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

By default `doc` returns a [`Sampler`](#class-docsampler) instance that collects metrics about cpu, memory usage, event loop delay and event loop utilization (only on Node versions that [support it](https://nodejs.org/docs/latest-v14.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2)).

```js
const doc = require('@dnlup/doc');

const sampler = doc(); // Use the default options

sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.raw) // Available only on Node versions that support it
})
```

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
})
```

You can enable more metrics if you need them.

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

It creates a metrics [`Sampler`](#class-docsampler) instance with the given options.

* `options` `<Object>`: same as the `Sampler` [`options`](#new-docsampleroptions).
* Returns: [`<Sampler>`](#class-docsampler)

### Class: `doc.Sampler`

* Extends [`EventEmitter`](https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).

Metrics sampler.

It collects the selected metrics at a regular interval. A `Sampler` instance is stateful so, on each tick,
only the values of the last sample are available. Each time the sampler emits the [`sample`](#event-sample) event, it will overwrite the previous one.

#### new `doc.Sampler([options])`

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-sample) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to track the event loop delay and this allows to increase the default `sampleInterval`.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v12.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `eventLoopOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `resourceUsage` `<boolean>`: enable [resourceUsage](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_resourceusage) metric. **Default:** `false`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `eventLoopUtilization` `<boolean>`: enable [eventLoopUtilization](https://nodejs.org/docs/latest-v14.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) metric. **Default:** `true` on Node versions that support it.
    * `memory` `<boolean>`: enable memory metric. **Default:** `true`.
    * `gc` `<boolean>`: enable garbage collection metric. **Default:** `false`.
    * `activeHandles` `<boolean>`: enable active handles collection metric. **Default:** `false`.

If `options.collect.resourceUsage` is set to `true`, `options.collect.cpu` will be set to false because the cpu metric is already available in the [`resource usage metric`](#samplerresourceusage).

#### Event: '`sample`'

Emitted every `sampleInterval`, it signals that new data the sampler has collected new data. 

#### `sampler.start()`

Start collecting metrics.

#### `sampler.stop()`

Stop collecting metrics.

#### `sampler.cpu`

* [`<CpuMetric>`](#class-cpumetric)

Resource usage metric instance.

#### `sampler.resourceUsage`

* [`<ResourceUsageMetric>`](#class-resourceusagemetric)

Resource usage metric instance.

#### `sampler.eventLoopDelay`

* [`<EventLoopDelayMetric>`](#class-eventloopdelaymetric)

Event loop delay metric instance.

#### `sampler.eventLoopUtilization`

* [`<EventLoopUtilizationMetric>`](#class-eventlooputilizationmetric)

Event loop utilization metric instance.

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

It exposes both computed and raw values of the cpu usage.

#### `cpuMetric.usage`

* `<number>`

Cpu usage in percentage.

#### `cpuMetric.raw`

* `<object>`

Raw value returned by [`process.cpuUsage()`](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_cpuusage_previousvalue).

### Class: `ResourceUsageMetric`

It exposes both computed and raw values of the process resource usage.

#### `resourceUsage.cpu`

* `<number>`

Cpu usage in percentage.

#### `resourceUsage.raw`

* `<object>`

Raw value returned by [`process.resourceUsage()`](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_resourceusage).

### Class: `EventLoopDelayMetric`

It exposes both computed and raw values about the event loop delay.

#### `eventLoopDelay.computed`

* `<number>`

Event loop delay in milliseconds. On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v13.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options), it computes this value using the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance. Otherwise, it uses a simple timer to calculate it.

#### `eventLoopDelay.raw`

* `<Histogram|number>`

On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) this exposes the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance. Otherwise, it exposes the raw delay value in nanoseconds.

#### `eventLoopDelay.compute(raw)`

* `raw` `<number>` The raw value obtained using the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) API.
* Returns `<number>` The computed delay value.

This function works only on node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). It allows to get computed values of the event loop delay from statistics other than the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

### Class: `EventLoopUtilizationMetric`

It exposes raw values about the event loop utilization.

#### `eventLoopUtilization.raw`

* `<object>`

Raw value returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v14.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.

### Class: `GCMetric`

It exposes the garbage collector activity only with computed values. It calculates the rolling average of each type of operation during the specified `sampleInterval`.

#### `gcMetric.major`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `major`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.minor`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `minor`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.incremental`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `incremental`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.weakCb`

* [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `weakCb`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

### Class: `GCAggregatedEntry`

It contains aggregated data about a specific garbage collector operation.

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

On Node versions that support [`flags`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags) this `Map` is populated with additional metrics about the number of times it encounters a specific flag and the total time (in milliseconds) spent on the operation with this flag.

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

The number of times that it has encountered the flag.

###### `total`

* `<number>`

The total time (in milliseconds) spent on the operations with this flag.

## Contributing

You found a bug or want to discuss and implement a new feature? This project welcomes contributions.

The code follows the [standardjs](https://standardjs.com/) style guide.

Every contribution should pass the existing tests or implementing new ones if that's the case.

```bash
# Run tests locally
$ npm test

# Run js tests
$ npm test:js

# Run typescript types tests
$ npm test:ts

# Lint all the code
$ npm lint

# Lint only js files
$ npm lint:js

# Lint only typescript files
$ npm lint:ts

# Create the TOC in the README
$ npm run doc
```

## Credits

When writing this module, I took a lot of inspiration from the fantastic [Node Clinic Doctor](https://github.com/clinicjs/node-clinic-doctor) package.
