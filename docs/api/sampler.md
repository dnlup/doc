# Class: `Sampler`

* Extends [`EventEmitter`](https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).

Metrics sampler.

It collects the selected metrics at a regular interval. A `Sampler` instance is stateful so, on each tick,
only the values of the last sample are available. Each time the sampler emits the [`sample`](#event-39sample39) event, it will overwrite the previous one.

### new `Sampler([options])`

* `options` `<Object>`
  * `sampleInterval` `<number>`: sample interval (ms) to get a sample. On each `sampleInterval` ms a [`sample`](#event-39sample39) event is emitted. **Default:** `500` on Node < 11.10.0, `1000` otherwise. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) when available to track the event loop delay and this allows to increase the default `sampleInterval`.
  * `autoStart` `<boolean>`: start automatically to collect metrics. **Default:** `true`.
  * `unref` `<boolean>`: [unref](https://nodejs.org/dist/latest-v12.x/docs/api/timers.html#timers_timeout_unref) the timer used to schedule the sampling interval. **Default:** `true`.
  * `gcOptions` `<Object>`: Garbage collection options
    * `aggregate` `<boolean>`: Track and aggregate statistics about each garbage collection operation ([more info](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_kind)). **Default:** `false`
    * `flags` `<boolean>`: , Track statistics about the flags of each (aggregated) garbage collection operation ([more info](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_flags)). `aggregate` has to be `true` to enable this option. **Default:** `true` on Node version `12.17.0` and newer.
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

### Event: '`sample`'

Emitted every `sampleInterval`, it signals that new data the sampler has collected new data. 

### `sampler.start()`

Start collecting metrics.

### `sampler.stop()`

Stop collecting metrics.

### `sampler.cpu`

* [`<CpuMetric>`](/api/cpu.md#class-cpumetric)

Resource usage metric instance.

### `sampler.resourceUsage`

* [`<ResourceUsageMetric>`](/api/resourceusage.md#class-resourceusagemetric)

Resource usage metric instance.

### `sampler.eventLoopDelay`

* [`<EventLoopDelayMetric>`](/api/eventloopdelay.md#class-eventloopdelaymetric)

Event loop delay metric instance.

### `sampler.eventLoopUtilization`

* [`<EventLoopUtilizationMetric>`](/api/eventlooputilization.md#class-eventlooputilizationmetric)

Event loop utilization metric instance.

### `sampler.gc`

* [`<GCMetric>`](/api/gc.md#class-gcmetric)

Garbage collector metric instance.

### `sampler.activeHandles`

* `<number>`

Number of active handles returned by `process._getActiveHandles()`.

### `sampler.memory`

* `<object>`

Object returned by [`process.memoryUsage()`](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_memoryusage).
