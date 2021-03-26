# Class: `GCMetric`

It exposes the garbage collector activity statistics in the specified `sampleInterval` using hdr histograms.

## `new GCMetric(options)`

* `options` `<object>`: Configuration options
  * `aggregate` `<boolean>`: See `gcOptions.aggregate` in the [Sampler options](#new-docsampleroptions).
  * `flags` `<boolean>`: See `gcOptions.flags` in the [Sampler options](#new-docsampleroptions).

## `gcMetric.pause`

* [`<GCEntry>`](#class-gcentry)

It tracks the global activity of the garbage collector.

## `gcMetric.major`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `major`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

## `gcMetric.minor`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `minor`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

## `gcMetric.incremental`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `incremental`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

## `gcMetric.weakCb`

* [`<GCEntry>`](#class-gcentry) | [`<GCAggregatedEntry>`](#class-gcaggregatedentry)

The activity of the operation of type `weakCb`. It's present only if `GCMetric` has been created with the option `aggregate` equal to `true`.

See [`performanceEntry.kind`](https://nodejs.org/dist/latest-v12.x/docs/api/perf_hooks.html#perf_hooks_performanceentry_kind).

# Class: `GCEntry`

It contains garbage collection data, represented with an [hdr histogram](https://github.com/HdrHistogram/HdrHistogramJS). All timing values are expressed in nanoseconds.

## `new GCEntry()`

The initialization doesn't require options. It is created internally by a [`GCMetric`](#class-gcmetric).

## `gcEntry.totalDuration`

* `<number>`

It is the total time of the entry in nanoseconds.

## `gcEntry.totalCount`

* `<number>`

It is the total number of operations counted.

## `gcEntry.mean`

* `<number>`

It is the mean value of the entry in nanoseconds.

## `gcEntry.max`

* `<number>`

It is the maximum value of the entry in nanoseconds.

## `gcEntry.min`

* `<number>`

It is the minimum value of the entry in nanoseconds.

## `gcEntry.stdDeviation`

* `<number>`

It is the standard deviation of the entry in nanoseconds.

## `gcEntry.summary`

* `<object>`

The hdr histogram summary. See https://github.com/HdrHistogram/HdrHistogramJS#record-values-and-retrieve-metrics.

## `gcEntry.getPercentile(percentile)`

* `percentile` `<number>`: Get a percentile from the histogram.
* Returns `<number>` The percentile

See https://github.com/HdrHistogram/HdrHistogramJS#record-values-and-retrieve-metrics.

# Class: `GCAggregatedEntry`

It extends [`GCEntry`](#class-gcentry) and contains garbage collection data plus the flags associated with it (see https://nodejs.org/docs/latest-v12.x/api/perf_hooks.html#perf_hooks_performanceentry_flags).

## `new GCAggregatedEntry()`

The initialization doesn't require options. It is created internally by a [`GCMetric`](#class-gcmetric).

## `gcAggregatedEntry.flags`

* `<object>`

This object contains the various hdr histograms of each flag.

## `gcAggregatedEntry.flags.no`

* [`<GCEntry>`](#class-gcentry)

## `gcAggregatedEntry.flags.constructRetained`

* [`<GCEntry>`](#class-gcentry)


## `gcAggregatedEntry.flags.forced`

* [`<GCEntry>`](#class-gcentry)


## `gcAggregatedEntry.flags.synchronousPhantomProcessing`

* [`<GCEntry>`](#class-gcentry)


## `gcAggregatedEntry.flags.allAvailableGarbage`

* [`<GCEntry>`](#class-gcentry)


## `gcAggregatedEntry.flags.allExternalMemory`

* [`<GCEntry>`](#class-gcentry)

## `gcAggregatedEntry.flags.scheduleIdle`

* [`<GCEntry>`](#class-gcentry)
