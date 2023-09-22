import { EventLoopUtilization } from "perf_hooks"

export interface EventLoopUtilizationMetric {
  /**
    * Raw metric value
    */
   raw: EventLoopUtilization
}
