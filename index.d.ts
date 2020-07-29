import { EventEmitter } from 'events' // eslint-disable-line no-unused-vars

declare namespace Doc {
  interface DocOptions {
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
       * The sampling rate in milliseconds. Must be greater than zero. Default: 10.
       */
      resolution: number,
    }
    collect?: {
      cpu?: boolean,
      eventLoopDelay?: boolean,
      memory?: boolean,
      gc?: boolean
    }
  }

  /**
   * On Node 12 and above this is a Histogram instance from 'perf_hooks'.
   */
  interface EventLoopDelayHistogram {
    min: number,
    max: number,
    mean: number,
    stddev: number,
    percentiles: Map<number, number>,
    exceeds: number,
  }

  interface DocData {
    /**
     * Event loop delay (ms).
     */
    eventLoopDelay: number,
    /**
     * Object containing memory usage stats.
     */
    memory: {
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
    },
    /**
     * CPU usage percentage.
     */
    cpu: number,
    /**
     * Object containing garbage collection stats.
     */
    gc: {
      /**
       * Average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR
       */
      major: number,
      /**
       * Average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR
       */
      minor: number,
      /**
       * Average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL
       */
      incremental: number,
      /**
       * Average duration (ms) of perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB
       */
      weakCB: number,
    },
    /**
     * Object containing raw values
     */
    raw: {
      /**
       * Raw representation of the event loop delay, on Node 10 it is the delay
       * in nanoseconds, on Node >= 11.10.0 is a Histogram instance
       */
      eventLoopDelay: number | EventLoopDelayHistogram,
      /**
       * Object containing the raw values returned from `process.cpuUsage()`.
       */
      cpu: {
        user: number,
        system: number,
      },
    }
  }

  interface DocInstance extends EventEmitter {
    on(event: 'data', listener: (data: DocData) => void): this
  }
}

declare function Doc(options?: Doc.DocOptions): Doc.DocInstance // eslint-disable-line no-redeclare

export = Doc
