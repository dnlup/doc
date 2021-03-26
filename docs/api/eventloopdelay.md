# Class: `EventLoopDelayMetric`

It exposes both computed and raw values about the event loop delay.

## `eventLoopDelay.computed`

* `<number>`

Event loop delay in milliseconds. On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v13.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options), it computes this value using the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance. Otherwise, it uses a simple timer to calculate it.

## `eventLoopDelay.raw`

* [`<Histogram>`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) | `<number>`

On Node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options) this exposes the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance. Otherwise, it exposes the raw delay value in nanoseconds.

## `eventLoopDelay.compute(raw)`

* `raw` `<number>` The raw value obtained using the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) API.
* Returns `<number>` The computed delay value.

This function works only on node versions that support [`monitorEventLoopDelay`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_perf_hooks_monitoreventloopdelay_options). It allows to get computed values of the event loop delay from statistics other than the `mean` of the [`Histogram`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_class_histogram) instance.

