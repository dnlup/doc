import { RecordableHistogram } from 'perf_hooks';

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
  /**
   * Total time of the entry in nanoseconds
   */
  totalDuration: number;
  /**
   * Total number of operations counted
   */
  // @types/node is not aligned with Node implementation. Let's wait for a fix.
  // @ts-ignore
  totalCount: RecordableHistogram['count'];
  /**
   * Mean value in nanoseconds
   */
  mean: RecordableHistogram['mean'];
  /**
   * Max value in nanoseconds
   */
  max: RecordableHistogram['max'];
  /**
   * Min value in nanoseconds
   */
  min: RecordableHistogram['min'];
  /**
   * Standard deviation in nanoseconds
   */
  stdDeviation: RecordableHistogram['stddev'];
  /**
   * Get a percentile
   */
  getValueAtPercentile: RecordableHistogram['percentile'];
}

export class GCAggregatedEntry extends GCEntry {
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
  major: GCEntry|GCAggregatedEntry|undefined;
  minor: GCEntry|GCAggregatedEntry|undefined;
  incremental: GCEntry|GCAggregatedEntry|undefined;
  weakCb: GCEntry|GCAggregatedEntry|undefined;
}
