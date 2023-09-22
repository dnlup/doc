import { IntervalHistogram } from "perf_hooks";

export interface EventLoopDelayMetric {
  /**
    * computed delay in milliseconds
    */
  computed: number,
  raw: IntervalHistogram
}
