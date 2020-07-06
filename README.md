# doc

<div style="text-align: center"><img src=./doc.webp style="border-radius: 50%;" alt="Doc Brown"></div>

[![npm version](https://badge.fury.io/js/%40dnlup%2Fdoc.svg)](https://badge.fury.io/js/%40dnlup%2Fdoc)
![Tests](https://github.com/dnlup/doc/workflows/Tests/badge.svg)

> See how many Gigawatts your Node.js process is using.

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  * [Doc([options])](#docoptions)
    + [events](#events)
      - [data](#data)

<!-- tocstop -->

## Installation

```bash
$ npm i @dnlup/doc
```

## Usage
```js
const Doc = require('@dnlup/doc');

const doc = Doc(); // Use the default sample interval
doc.on('data', data => {
  doStuffWithCpuUsage(data.cpu)
  doStuffWithMemoryUsage(data.memory)
  doStuffWithEventLoopDelay(data.eventLoopDelay)
  doStuffWithGarbageCollectionDuration(data.gc)
})
```

## API

### Doc([options])

> Create a new Doc instance with the given options.

* `options`: `Object`. Optional. Configuration object
* `options.sampleInterval`: `Number`. Optional. Sample interval (ms), each `sampleInterval` ms a [data](#data) event is emitted. On Node 10 the default value is `500` while on Node >= 12 is `1000`. Under the hood the package uses [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) where available to sample the event loop and this allows to increase the default sample interval on Node >= 12.
* `options.eventLoopOptions`: `Object`. Optional. Options to setup [`monitorEventLoopDelay`](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options)

#### events
##### data
Process data event.

Properties:

|Name|Description|
|----|----|
| `eventLoopDelay` | Event loop delay (ms) |
| `memory` | Object containing memory usage stats |
| `memory.rss` | RSS memory (bytes) |
| `memory.heapTotal` | Total heap Memory (bytes) |
| `memory.heapUsed` | Heap memory used (bytes) |
| `memory.external` | Extarnal memory (bytes) |
| `cpu` | Cpu usage percentage |
| `gc` | Object containing garbage collection stats |
| `gc.major` | average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR |
| `gc.minor` | average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR |
| `gc.incremental` | average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL |
| `gc.weakCB` | average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB |
| `raw` | Object containing raw values |
| `raw.cpu` | Object containing the raw values returned from [`process.cpuUsage()`](https://nodejs.org/docs/latest-v12.x/api/process.html#process_process_cpuusage_previousvalue) |
| `raw.eventLoopDelay` | Raw representation of the event loop delay, on Node 10 it is the delay in nanoseconds, on Node >= 11.10.0 is a [Histogram instance](https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_class_histogram) |
