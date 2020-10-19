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

export interface EventLoopDelayMetric {
  /**
    * computed delay in milliseconds
    */
  computed: number,
  raw: number | EventLoopDelayHistogram
}
