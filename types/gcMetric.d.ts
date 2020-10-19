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

declare interface GCOpStats {
  count: number,
  total: number,
  average: number
}

declare interface GCAggregatedEntry extends GCOpStats {
  flags?: Map<GCFlag, GCOpStats>
}

export interface GCMetric {
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR */
  major: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR */
  minor: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL */
  incremental: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB */
  weakCb: GCAggregatedEntry
}
