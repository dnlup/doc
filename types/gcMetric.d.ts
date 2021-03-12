import { HistogramSummary, WasmHistogram } from 'hdr-histogram-js'

declare enum GCFlag {
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO */
  No = 'no',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED */
  ConstructRetained = 'constructRetained',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED */
  Forced = 'forced',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING */
  SynchronousPhantomProcessing = 'synchronousPhantomProcessing',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE */
  AllAvailableGarbage = 'allAvailableGarbage',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY */
  AllExternalMemory = 'allExternalMemory',
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE */
  ScheduleIdle = 'scheduleIdle'
}

export class GCEntry {
  totalDuration: number;
  totalCount: WasmHistogram['totalCount'];
  mean: WasmHistogram['mean'];
  max: WasmHistogram['maxValue'];
  min: WasmHistogram['minNonZeroValue'];
  stdDeviation: WasmHistogram['stdDeviation'];
  summary: HistogramSummary;
  getValueAtPercentile: WasmHistogram['getValueAtPercentile'];
}

export class GCAggregatedEntry extends GCEntry {
  constructor(flags: boolean);
  flags: {
    no: GCEntry,
    constructRetained: GCEntry,
    forced: GCEntry,
    synchronousPhantomProcessing: GCEntry,
    allAvailableGarbage: GCEntry,
    allExternalMemory: GCEntry,
    scheduleIdle: GCEntry
  }
}

declare interface GCMetricOptions {
  /**
   * Aggregate statistic by the type of GC operation.
   */
  aggregate: boolean,
  /**
   * Enable tracking of GC flags in aggregated metric
   */
  flags: boolean
}

export class GCMetric {
  constructor(options: GCMetricOptions);
  pause: GCEntry;
  major: GCAggregatedEntry|undefined;
  minor: GCAggregatedEntry|undefined;
  incremental: GCAggregatedEntry|undefined;
  weakCb: GCAggregatedEntry|undefined;
}
