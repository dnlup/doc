export interface CPUMetric {
  /**
    * Usage percentage
    */
  usage: number,
  /**
    * Raw value returned by `process.cpuUsage()`
    */
  raw: NodeJS.CpuUsage
}
