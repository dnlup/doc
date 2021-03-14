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
      - [Enable/disable metrics collection](#enabledisable-metrics-collection)
        * [Garbage collection](#garbage-collection)
        * [Active handles](#active-handles)
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
    + [`gcEntry.summary`](#gcentrysummary)
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
  * [`doc.eventLoopUtilizationSupported`](#doceventlooputilizationsupported)
  * [`doc.resourceUsageSupported`](#docresourceusagesupported)
  * [`doc.gcFlagsSupported`](#docgcflagssupported)

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

By default `doc` returns a [`Sampler`](#class-docsampler) instance that collects metrics about cpu, memory usage, event loop delay and event loop utilization (only on Node versions that [support it](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2)).

```js
const doc = require('@dnlup/doc')

const sampler = doc() // Use the default options

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
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.raw) // Available only on Node versions that support it
})
```

You can enable more metrics if you need them.

###### Garbage collection

```js
const doc = require('@dnlup/doc')

const sampler = doc({ collect: { gc: true } })
sampler.on('sample', () => {
  doStuffWithCpuUsage(sampler.cpu.usage)
  doStuffWithMemoryUsage(sampler.memory)
  doStuffWithEventLoopDelay(sampler.eventLoopDelay.computed)
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.raw) // Available only on Node versions that support it
  doStuffWithGarbageCollectionDuration(sampler.gc.pause)
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
  doStuffWithEventLoopUtilization(sampler.eventLoopUtilization.raw) // Available only on Node versions that support it
  doStuffWithActiveHandles(sampler.activeHandles)
})
```

## API

### `doc([options])`

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
  * `gcOptions` `<Object>`: Garbage collection options
    * `aggregate` `<boolean>`: Track and aggregate statistics about each garbage collection operation (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_kind). **Default:** `false`
    * `flags` `<boolean>`: , Track statistics about the flags of each (aggregated) garbage collection operation (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_flags). `aggregate` has to be `true` to enable this option. **Default:** `true` on Node version `12.17.0` and newer.
  * `eventLoopDelayOptions` `<Object>`: Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). **Default:** `{ resolution: 10 }`
  * `collect` `<Object>`: enable/disable the collection of specific metrics.
    * `cpu` `<boolean>`: enable cpu metric. **Default:** `true`.
    * `resourceUsage` `<boolean>`: enable [resourceUsage](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_resourceusage) metric. **Default:** `false`.
    * `eventLoopDelay` `<boolean>`: enable eventLoopDelay metric. **Default:** `true`.
    * `eventLoopUtilization` `<boolean>`: enable [eventLoopUtilization](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) metric. **Default:** `true` on Node version `12.19.0` and newer.
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

* `<Histogram>` | `<number>`

On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) this exposes the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance. Otherwise, it exposes the raw delay value in nanoseconds.

#### `eventLoopDelay.compute(raw)`

* `raw` `<number>` The raw value obtained using the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) API.
* Returns `<number>` The computed delay value.

This function works only on node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). It allows to get computed values of the event loop delay from statistics other than the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

### Class: `EventLoopUtilizationMetric`

It exposes raw values about the event loop utilization.

#### `eventLoopUtilization.raw`

* `<object>`

Raw value returned by [`performance.eventLoopUtilization()`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2) during the `sampleInterval` window.

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

The activity of the operation of type `major`. It's present only if `GCMEtric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.minor`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `minor`. It's present only if `GCMEtric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.incremental`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `incremental`. It's present only if `GCMEtric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

#### `gcMetric.weakCb`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `weakCb`. It's present only if `GCMEtric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

### Class: `GCEntry`

It contains garbage collection data, represented with an [hdr histogram](https://github.com/HdrHistogram/HdrHistogramJS). All timing values are expressed in nanoseconds.

#### `new GCEntry()`

The initialization doesn't require options. It is created internally by a [`GCMEtric`](#class-gcmetric).

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

#### `gcEntry.summary`

* `<object>`

The hdr histogram summary. See https://github.com/HdrHistogram/HdrHistogramJS#record-values-and-retrieve-metrics.

#### `gcEntry.getPercentile(percentile)`

* `percentile` `<number>`: Get a percentile from the histogram.
* Returns `<number>` The percentile

See https://github.com/HdrHistogram/HdrHistogramJS#record-values-and-retrieve-metrics.

### Class: `GCAggregatedEntry`

It extends [`GCEntry`](#class-gcentry) and contains garbage collection data plus the flags associated with it (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_flags).

#### `new GCAggregatedEntry()`

The initialization doesn't require options. It is created internally by a [`GCMEtric`](#class-gcmetric).

#### `gcAggregatedEntry.flags`

* `<object>`

This object contains the various hdr histograms of each flag.
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

### `doc.eventLoopUtilizationSupported`

* `<boolean>`

It tells if the Node.js version in use supports the [eventLoopUtilization metric](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2).

### `doc.resourceUsageSupported`

* `<boolean>`

It tells if the Node.js version in use supports the [resourceUsage metric](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_resourceusage).

### `doc.gcFlagsSupported`

* `<boolean>`

It tells if the Node.js version in use supports [GC flags](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags).
