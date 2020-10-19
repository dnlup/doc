export interface EventLoopUtilizationMetric {
  /**
    * Raw metric value
    */
   raw: {
      idle: number,
      active: number,
      utilization: number
   }
}

