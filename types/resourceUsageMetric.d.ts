import { resourceUsage } from "process";

type ResourceUsage = ReturnType<typeof resourceUsage>

export interface ResourceUsageMetric {
  /**
    * Cpu usage percentage
    */
   cpu: number,
   /**
     * Raw vaule returned by `process.resourceUsage()`
     */
   raw: ResourceUsage
}
