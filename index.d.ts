import { EventEmitter } from 'events' // eslint-disable-line no-unused-vars

declare interface SamplerOptions {
  /**
   * Sample interval (ms), each sampleInterval ms a data event is emitted.
   * On Node 10 the default value is 500 while on Node >= 12 is 1000.
   * Under the hood the package uses monitorEventLoopDelay where available to
   * sample the event loop and this allows to increase the default sample
   * interval on Node >= 12.
   */
  sampleInterval?: number,

  /**
   * Options to setup `perf_hooks.monitorEventLoopDelay`.
   */
  eventLoopOptions?: {
    /**
     * The sampling rate in milliseconds. Must be greater than zero and than the sampleInterval. Default: 10.
     */
    resolution: number,
  }
  /**
    * Enable/disable specific metrics
    */
  collect?: {
    cpu?: boolean,
    eventLoopDelay?: boolean,
    memory?: boolean,
    gc?: boolean,
    activeHandles?: boolean
  }
}

declare interface CPUMetric {
  /**
    * Usage percentage
    */
  usage: number,
  /**
    * Raw value returned by `process.cpuUsage()`
    */
  raw: number
}

/**
 * On Node 12 and above this is a Histogram instance from 'perf_hooks'.
 */
declare interface EventLoopDelayHistogram {
  min: number,
  max: number,
  mean: number,
  stddev: number,
  percentiles: Map<number, number>,
  exceeds: number,
}
declare interface EventLoopDelayMetric {
  /**
    * computed delay in milliseconds
    */
  computed: number,
  raw: number | EventLoopDelayHistogram
}

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
declare interface GCMetric {
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR */
  major: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR */
  minor: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL */
  incremental: GCAggregatedEntry,
  /** perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB */
  weakCb: GCAggregatedEntry
}

declare interface MemoryMetric {
   /**
    * RSS memory (bytes).
    */
   rss: number,
   /**
    * Total heap Memory (bytes).
    */
   heapTotal: number,
   /**
    * Heap memory used (bytes).
    */
   heapUsed: number,
   /**
    * External memory (bytes).
    */
   external: number,
   /**
     * arrayBuffers memory (bytes). This value is `undefined` on Node <= 10
     */
   arrayBuffers?: number
}

declare class Sampler extends EventEmitter {
  cpu?: CPUMetric
  eventLoopDelay?: EventLoopDelayMetric
  gc?: GCMetric
  memory?: MemoryMetric
  activeHandles?: number
  on(event: 'sample', listener: () => void): this
  start(): void
  stop(): void
}

declare function createSampler(options?: SamplerOptions): Sampler

export default createSampler

export {
  Sampler,
  SamplerOptions,
  createSampler,
  CPUMetric,
  EventLoopDelayMetric,
  GCMetric,
  GCAggregatedEntry,
  GCFlag,
  GCOpStats,
  MemoryMetric
}
