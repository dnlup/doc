# doc

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)
![Tests](https://github.com/dnlup/doc/workflows/Tests/badge.svg)
![Benchmarks](https://github.com/dnlup/doc/workflows/Benchmarks/badge.svg)
[![codecov](https://codecov.io/gh/dnlup/doc/branch/next/graph/badge.svg?token=2I4S01J2X3)](https://codecov.io/gh/dnlup/doc)
[![Known Vulnerabilities](https://snyk.io/test/github/dnlup/doc/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dnlup/doc?targetFile=package.json)

> Get usage and health data about your Node.js process.

`doc` is a small module that helps you collect health metrics about your Node.js process.
It does that by using only the API available on Node itself (no native dependencies).
It doesn't have any ties with an APM platform, so you are free to use anything you want for that purpose.
Its API lets you access both computed and raw values, where possible.

<!-- toc -->

- [Installation](#installation)
        * [latest stable version](#latest-stable-version)
        * [latest development version](#latest-development-version)
- [Usage](#usage)
        * [Importing with CommonJS](#importing-with-commonjs)
        * [Importing with ESM](#importing-with-esm)
        * [Note](#note)
      - [Enable/disable metrics collection](#enabledisable-metrics-collection)
      - [Garbage collection](#garbage-collection)
      - [Active handles](#active-handles)
  * [Examples](#examples)
- [API](#api)
  * [`doc([options])`](#docoptions)
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
    + [`eventLoopUtilization.idle`](#eventlooputilizationidle)
    + [`eventLoopUtilization.active`](#eventlooputilizationactive)
    + [`eventLoopUtilization.utilization`](#eventlooputilizationutilization)
    + [`eventLoopUtilization.raw`](#eventlooputilizationraw)
  * [Class: `GCMetric`](#class-gcmetric)
    + [`new GCMetric(options)`](#new-gcmetricoptions)
  * [`gcMetric.pause`](#gcmetricpause)
    + [`gcMetric.major`](#gcmetricmajor)
    + [`gcMetric.minor`](#gcmetricminor)
    + [`gcMetric.incremental`](#gcmetricincremental)
    + [`gcMetric.weakCb`](#gcmetricweakcb)
  * [Class: `GCEntry`](#class-gcentry)
    + [`new GCEntry()`](#new-gcentry)
    + [`gcEntry.totalDuration`](#gcentrytotalduration)
    + [`gcEntry.totalCount`](#gcentrytotalcount)
    + [`gcEntry.mean`](#gcentrymean)
    + [`gcEntry.max`](#gcentrymax)
    + [`gcEntry.min`](#gcentrymin)
    + [`gcEntry.stdDeviation`](#gcentrystddeviation)
    + [`gcEntry.getPercentile(percentile)`](#gcentrygetpercentilepercentile)
  * [Class: `GCAggregatedEntry`](#class-gcaggregatedentry)
    + [`new GCAggregatedEntry()`](#new-gcaggregatedentry)
    + [`gcAggregatedEntry.flags`](#gcaggregatedentryflags)
    + [`gcAggregatedEntry.flags.no`](#gcaggregatedentryflagsno)
    + [`gcAggregatedEntry.flags.constructRetained`](#gcaggregatedentryflagsconstructretained)
    + [`gcAggregatedEntry.flags.forced`](#gcaggregatedentryflagsforced)
    + [`gcAggregatedEntry.flags.synchronousPhantomProcessing`](#gcaggregatedentryflagssynchronousphantomprocessing)
    + [`gcAggregatedEntry.flags.allAvailableGarbage`](#gcaggregatedentryflagsallavailablegarbage)
    + [`gcAggregatedEntry.flags.allExternalMemory`](#gcaggregatedentryflagsallexternalmemory)
    + [`gcAggregatedEntry.flags.scheduleIdle`](#gcaggregatedentryflagsscheduleidle)
  * [`doc.errors`](#docerrors)
- [License](#license)

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

You can import the module by using either CommonJS or ESM.

By default `doc` returns a [`Sampler`](#class-docsampler) instance that collects metrics about cpu, memory usage, event loop delay and event loop utilization.

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

You can find more examples in the [`examples`](./examples) folder.

## API

### `doc([options])`

It creates a metrics [`Sampler`](#class-docsampler) instance with the given options.

* `options` `<Object>`: same as the `Sampler` [`options`](#new-docsampleroptions).
* Returns: [`<Sampler>`](#class-docsampler)

### Class: `doc.Sampler`

* Extends [`EventEmitter`](https://nodejs.org/dist/latest-v18.x/docs/api/events.html#events_class_eventemitter).

Metrics sampler.

It collects the selected metrics at a regular interval. A `Sampler` instance is stateful so, on each tick,
only the values of the last sample are available. Each time the sampler emits the [`sample`](#event-sample) event, it will overwrite the previous one.

#### new `doc.Sampler([options])`

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-sample) event is emitted. **Default:** `1000` Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) to track the event loop delay.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v18.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `gcOptions` `<Object>`: Garbage collection options
    * `aggregate` `<boolean>`: Track and aggregate statistics about each garbage collection operation (see https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performanceentry_kind). **Default:** `false`
    * `flags` `<boolean>`: , Track statistics about the flags of each (aggregated) garbage collection operation (see https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performanceentry_flags). `aggregate` has to be `true` to enable this option. **Default:** `true` on Node version `12.17.0` and newer.
  * `eventLoopDelayOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `resourceUsage` `<boolean>`: enable [resourceUsage](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_resourceusage) metric. **Default:** `false`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `eventLoopUtilization` `<boolean>`: enable [eventLoopUtilization](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) metric. **Default:** `true` on Node version `12.19.0` and newer.
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

Object returned by [`process.memoryUsage()`](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#process_process_memoryusage).

### Class: `CpuMetric`

It exposes both computed and raw values of the cpu usage.

#### `cpuMetric.usage`

* `<number>`

Cpu usage in percentage.

#### `cpuMetric.raw`

* `<object>`

Raw value returned by [`process.cpuUsage()`](https://nodejs.org/dist/latest-v18.x/docs/api/process.html#process_process_cpuusage_previousvalue).

### Class: `ResourceUsageMetric`

It exposes both computed and raw values of the process resource usage.

#### `resourceUsage.cpu`

* `<number>`

Cpu usage in percentage.

#### `resourceUsage.raw`

* `<object>`

Raw value returned by [`process.resourceUsage()`](https://nodejs.org/docs/latest-v18.x/api/process.html#process_process_resourceusage).

### Class: `EventLoopDelayMetric`

It exposes both computed and raw values about the event loop delay.

#### `eventLoopDelay.computed`

* `<number>`

Event loop delay in milliseconds. It computes this value using the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

#### `eventLoopDelay.raw`

* `<Histogram>`

Exposes the [`Histogram`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

#### `eventLoopDelay.compute(raw)`

* `raw` `<number>` The raw value obtained using the [`Histogram`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) API.
* Returns `<number>` The computed delay value.

### Class: `EventLoopUtilizationMetric`

It exposes statistics about the event loop utilization.

#### `eventLoopUtilization.idle`

* `<number>`

The `idle` value in the object returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.

#### `eventLoopUtilization.active`

* `<number>`

The `active` value in the object returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.
#### `eventLoopUtilization.utilization`

* `<number>`

The `utilization` value in the object returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.

#### `eventLoopUtilization.raw`

* `<object>`

Raw value returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v18.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.

### Class: `GCMetric`

It exposes the garbage collector activity statistics in the specified `sampleInterval` using hdr histograms.

#### `new GCMetric(options)`

* `options` `<object>`: Configuration options
  * `aggregate` `<boolean>`: See `gcOptions.aggregate` in the [Sampler options](#new-docsampleroptions).
  * `flags` `<boolean>`: See `gcOptions.flags` in the [Sampler options](#new-docsampleroptions).

### `gcMetric.pause`

* [`<GCEntry>`](#class-gcentry)

It tracks the global activity of the garbage collector.

#### `gcMetric.major`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `major`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.minor`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `minor`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.incremental`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `incremental`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.weakCb`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `weakCb`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

### Class: `GCEntry`

It contains garbage collection data, represented with an [histogram](https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#class-recordablehistogram-extends-histogram). All timing values are expressed in nanoseconds.

#### `new GCEntry()`

The initialization doesn't require options. It is created internally by a [`GCMetric`](#class-gcmetric).

#### `gcEntry.totalDuration`

* `<number>`

It is the total time of the entry in nanoseconds.

#### `gcEntry.totalCount`

* `<number>`

It is the total number of operations counted.

#### `gcEntry.mean`

* `<number>`

It is the mean value of the entry in nanoseconds.
#### `gcEntry.max`

* `<number>`

It is the maximum value of the entry in nanoseconds.
#### `gcEntry.min`

* `<number>`

It is the minimum value of the entry in nanoseconds.

#### `gcEntry.stdDeviation`

* `<number>`

It is the standard deviation of the entry in nanoseconds.

#### `gcEntry.getPercentile(percentile)`

* `percentile` `<number>`: Get a percentile from the histogram.
* Returns `<number>` The percentile

### Class: `GCAggregatedEntry`

It extends [`GCEntry`](#class-gcentry) and contains garbage collection data plus the flags associated with it (see https://nodejs.org/dist/latest-v18.x/docs/api/perf_hooks.html#performanceentryflags).

#### `new GCAggregatedEntry()`

The initialization doesn't require options. It is created internally by a [`GCMetric`](#class-gcmetric).

#### `gcAggregatedEntry.flags`

* `<object>`

This object contains the various histograms of each flag.
#### `gcAggregatedEntry.flags.no`

* [`<GCEntry>`](#class-gcentry)

#### `gcAggregatedEntry.flags.constructRetained`

* [`<GCEntry>`](#class-gcentry)


#### `gcAggregatedEntry.flags.forced`

* [`<GCEntry>`](#class-gcentry)


#### `gcAggregatedEntry.flags.synchronousPhantomProcessing`

* [`<GCEntry>`](#class-gcentry)


#### `gcAggregatedEntry.flags.allAvailableGarbage`

* [`<GCEntry>`](#class-gcentry)


#### `gcAggregatedEntry.flags.allExternalMemory`

* [`<GCEntry>`](#class-gcentry)

#### `gcAggregatedEntry.flags.scheduleIdle`

* [`<GCEntry>`](#class-gcentry)


### `doc.errors`

In the `errors` object are exported all the custom errors used by the module.

| Error | Error Code | Description |
|-------|------------|-------------|
| `InvalidArgumentError` | `DOC_ERR_INVALID_ARG` | An invalid option or argument was used |
| `NotSupportedError` | `DOC_ERR_NOT_SUPPORTED` | A metric is not supported on the Node.js version used |

## License

[ISC](./LICENSE)
