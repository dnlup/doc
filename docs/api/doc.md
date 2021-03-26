# `doc([options])`

It creates a metrics [`Sampler`](#class-docsampler) instance with the given options.

* `options` `<Object>`: same as the `Sampler` [`options`](/api/sampler.md#new-sampleroptions).
* Returns: [`<Sampler>`](#class-docsampler)

## `doc.Sampler`

* [`Sampler`](/api/sampler.md)

## `doc.eventLoopUtilizationSupported`

* `<boolean>`

It tells if the Node.js version in use supports the [eventLoopUtilization metric](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performance_eventlooputilization_utilization1_utilization2).

## `doc.resourceUsageSupported`

* `<boolean>`

It tells if the Node.js version in use supports the [resourceUsage metric](https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_process_resourceusage).

## `doc.gcFlagsSupported`

* `<boolean>`

It tells if the Node.js version in use supports [GC flags](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_flags).

## `doc.errors`

In the `errors` object are exported all the custom errors used by the module.

| Error | Error Code | Description |
|-------|------------|-------------|
| `InvalidArgumentError` | `DOC_ERR_INVALID_ARG` | An invalid option or argument was used |
| `NotSupportedError` | `DOC_ERR_NOT_SUPPORTED` | A metric is not supported on the Node.js version used |
